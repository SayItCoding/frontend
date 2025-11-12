import { create } from "zustand";
import { nanoid } from "nanoid";

export const useChatStore = create((set, get) => ({
  messages: [],

  clear: () => set({ messages: [] }),

  appendAssistantChunk(id, chunk) {
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, content: m.content + chunk } : m
      ),
    }));
  },

  finishAssistantMessage(id) {
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, streaming: false } : m
      ),
    }));
  },

  async sendMessage(text) {
    const content = String(text || "").trim();
    if (!content) return;

    const userMsg = {
      id: nanoid(),
      role: "user",
      content,
      createdAt: Date.now(),
    };
    set((s) => ({ messages: [...s.messages, userMsg] }));

    // Assistant placeholder (stream target)
    const asstId = nanoid();
    set((s) => ({
      messages: [
        ...s.messages,
        {
          id: asstId,
          role: "assistant",
          content: "",
          createdAt: Date.now(),
          streaming: true,
        },
      ],
    }));

    try {
      // === SSE / fetch streaming example ===
      const resp = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: get().messages.map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        // Expecting lines like: `data: ...\n\n`
        for (const line of chunk.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();

          if (data === "[DONE]") {
            get().finishAssistantMessage(asstId);
            return;
          }

          get().appendAssistantChunk(asstId, data);
        }
      }

      get().finishAssistantMessage(asstId);
    } catch (e) {
      set((s) => ({
        messages: s.messages.map((m) =>
          m.id === asstId
            ? {
                ...m,
                role: "error",
                streaming: false,
                error: String(e),
                content: "오류가 발생했어요.",
              }
            : m
        ),
      }));
    }
  },
}));
