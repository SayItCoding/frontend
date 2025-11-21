import { useEffect, useRef } from "react";
import styled from "styled-components";
import { ChatMessageItem } from "./ChatMessageItem.jsx";

export function ChatMessageList({ messages, selectedCodeId, onMessageClick }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <List role="log" aria-live="polite" aria-relevant="additions">
      {messages?.map((m) => (
        <ChatMessageItem
          key={m.id}
          msg={m}
          onClick={onMessageClick}
          selected={m.missionCodeId === selectedCodeId}
        />
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
