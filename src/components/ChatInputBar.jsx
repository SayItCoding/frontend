import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ChatTag from "./ChatTag.jsx";

export function ChatInputBar({ onSend }) {
  const [val, setVal] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(180, el.scrollHeight) + "px";
  }, [val]);

  async function handleSend() {
    const text = val.trim();
    if (!text) return;

    setVal("");

    // ChatWindow에서 넘겨준 onSend 사용
    if (onSend) {
      await onSend(text);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <Wrap>
      <Row>
        <Text
          ref={ref}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="AI에게 코드 작성을 지시하고, 질문해보세요."
          aria-label="메시지 입력"
        />
        <Send onClick={handleSend} disabled={!val.trim()}>
          전송
        </Send>
      </Row>
    </Wrap>
  );
}

const Wrap = styled.div`
  border-top: 1px solid #eee;
  padding: 10px 12px;
  background: #fff;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;
`;

const Text = styled.textarea`
  width: 100%;
  min-height: 80px;
  max-height: 220px;
  resize: none;
  border: 1px solid #e5e5ea;
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
  font-size: 14px;
  &:focus {
    border-color: #2b65f5;
  }
`;

const Send = styled.button`
  flex: 0 0 auto;
  height: 80px;
  padding: 0 14px;
  border-radius: 10px;
  border: none;
  background: #2b65f5;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
