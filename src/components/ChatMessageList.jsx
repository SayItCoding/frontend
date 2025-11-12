import { useEffect, useRef } from "react";
import styled from "styled-components";
import { useChatStore } from "../stores/useChatStore.js";
import { ChatMessageItem } from "./ChatMessageItem.jsx";

export function ChatMessageList() {
  const { messages } = useChatStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <List role="log" aria-live="polite" aria-relevant="additions">
      {messages.map((m) => (
        <ChatMessageItem key={m.id} msg={m} />
      ))}
      <div ref={bottomRef} />
    </List>
  );
}

const List = styled.div`
  overflow-y: auto;
  padding: 16px 16px 8px;
  background: #f7f7f8;
`;
