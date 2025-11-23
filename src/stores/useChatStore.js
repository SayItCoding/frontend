import { create } from "zustand";
import { nanoid } from "nanoid";

const BACKEND_URL = 'https://sayit-coding-production.up.railway.app';

export const useChatStore = create((set, get) => ({
  messages: [],
  missionId: null,     // 현재 활성화된 미션 ID
  page: 1,             // 현재 페이지 번호
  hasMore: true,       // 더 로드할 대화가 있는지 여부
  isLoading: false,
  clear: () => set({ messages: [], page: 1, hasMore: true }),
  setMissionId: (id) => set({ 
    missionId: id, 
    messages: [], 
    page: 1, 
    hasMore: true, 
    isLoading: false 
  }),

  // 1. 대화 목록 조회 (GET API) 로직
  fetchChats: async (missionId, page = 1) => {
      const { messages, hasMore, isLoading } = get();
      if (isLoading || (page > 1 && !hasMore)) return;

      set({ isLoading: true });
        
      try {
        const url = `${BACKEND_URL}/api/v1/missions/${missionId}/chats?page=${page}&limit=${limit}`;
        const response = await fetch(url);
            
        if (!response.ok) {
          throw new Error(`대화 목록 조회 실패: ${response.status}`);
        }

        const data = await response.json();
        const newChats = data.items || [];
            
        set({
          // 페이지 1이면 덮어쓰고, 아니면 기존 채팅에 추가
          messages: page === 1 ? newChats : [...chats, ...newChats],
          page: page + 1,
          hasMore: newChats.length === limit, // 로드된 개수와 limit 비교
          isLoading: false,
        });

    } catch (error) {
      console.error("채팅 내역 로드 오류:", error);
      set({ isLoading: false });
    }
  },

  // 2. 메시지 전송 (POST API) 로직
  sendMessage: async (message) => {
    const { missionId, messages } = get();
    const content = String(text || "").trim();
    if (!missionId || !content) return;
        
    const userMessage = { 
      id: nanoid(),
      role: "user",
      content,
      createdAt: Date.now(), 
    };
        
    //UI에 사용자 메시지 즉시 반영
    set({ messages: [...messages, userMessage] });
        
    try {
      const url = `${BACKEND_URL}/api/v1/missions/${missionId}/chats`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }), //백엔드 요구 타입 { "message": "..." }?
      });
            
      if (!response.ok) {
        throw new Error(`메시지 전송 실패: HTTP ${response.status}`);
      }
            
      //여기서 백엔드가 응답으로 AI 메시지 JSON을 반환한다고 가정
      const assistantResponse = await response.json(); 
            
      const assistantMessage = {
        id: assistantResponse.id || nanoid(),
        role: assistantResponse.role || 'assistant',
        content: assistantResponse.content, 
        createdAt: Date.now(),
      };
            
      //UI에 AI 메시지 추가 반영
      set({ 
        messages: [...get().messages, assistantMessage], // messages로 통일
        isLoading: false,
      });
            
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      // 오류 메시지 처리 로직
      set((s) => ({
        isLoading: false,
        messages: s.messages.map((m) =>
          m.id === userMsg.id 
          ? { ...m, role: "error", error: String(e), content: "오류가 발생했어요. 다시 시도해 주세요." }
          : m
        ),
      }));
    }
  },


/*  Below is the previous streaming implementation for reference.
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
  */
}));
