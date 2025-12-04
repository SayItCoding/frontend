import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { ChatTag } from "./ChatTag.jsx";

export function ChatInputBar({ onSend, selectedBlock }) {
  const [val, setVal] = useState("");
  const ref = useRef(null);
  const containerRef = useRef(null); // ChatInputBar 전체 래퍼

  // Chat 영역 클릭 시 엔트리 쪽으로 이벤트 안 올라가게 막기
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const stopMouse = (e) => {
      const allow = e.target.closest("[data-allow-propagation='true']");
      if (allow) return;
      e.stopPropagation();
    };

    const stopKey = (e) => {
      // ChatInputBar 내부에서 발생한 이벤트만 처리
      if (!el.contains(e.target)) return;

      // Enter는 React onKeyDown으로 보내야 하니까 건드리지 말기
      if (e.key === "Enter") {
        return;
      }

      // 스페이스, 방향키 등만 막고 싶으면 여기서 조건 걸기
      if (e.code === "Space" || e.key === " ") {
        e.stopPropagation();
      }
    };

    el.addEventListener("mousedown", stopMouse, true);
    el.addEventListener("click", stopMouse, true);
    el.addEventListener("keydown", stopKey, true);
    el.addEventListener("keyup", stopKey, true);

    return () => {
      el.removeEventListener("mousedown", stopMouse, true);
      el.removeEventListener("click", stopMouse, true);
      el.removeEventListener("keydown", stopKey, true);
      el.removeEventListener("keyup", stopKey, true);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(180, el.scrollHeight) + "px";
  }, [val]);

  useEffect(() => {
    if (!selectedBlock) return;
    const el = ref.current;
    if (!el) return;

    const prefix = ``;
    setVal((prev) => {
      // 이미 같은 prefix가 있으면 중복으로 안 붙임
      if (prev.startsWith(prefix)) return prev;
      return `${prefix}${prev}`;
    });

    // 포커스 및 커서를 맨 끝으로
    requestAnimationFrame(() => {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    });
  }, [selectedBlock]);

  async function handleSend() {
    const text = val.trim();
    if (!text) return;

    setVal("");

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

  // 선택된 블록이 있을 때 태그에 보여줄 라벨
  const blockLabel = selectedBlock
    ? `블록 ID: ${selectedBlock.id ?? selectedBlock?.data?.id ?? "선택된 블록"}`
    : "";

  return (
    <Wrap ref={containerRef}>
      <Row>
        <InputBox>
          {selectedBlock && (
            <TagArea>
              <ChatTag label={blockLabel} />
            </TagArea>
          )}

          <Text
            ref={ref}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="AI에게 절차를 지시하고, 질문해보세요."
            aria-label="메시지 입력"
          />
        </InputBox>

        <Send
          data-allow-propagation="true"
          onClick={handleSend}
          disabled={!val.trim()}
        >
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

// 진짜 "입력창"처럼 보이는 박스 (태그 + textarea 포함)
const InputBox = styled.div`
  flex: 1;
  min-height: 80px;
  max-height: 220px;
  border: 1px solid #e5e5ea;
  border-radius: 12px;
  padding: 6px 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  background: #fff;

  &:focus-within {
    border-color: #2b65f5;
  }
`;

// 태그 영역: 한 줄에 태그가 표시되고, 그 옆/아래로 텍스트가 이어짐
const TagArea = styled.div`
  display: inline-flex;
  margin-bottom: 4px;
  margin-right: 4px;
`;

const Text = styled.textarea`
  flex: 1;
  min-height: 24px;
  max-height: 200px;
  resize: none;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 4px 4px 4px 0;
  line-height: 1.4;
  background: transparent;

  ::placeholder {
    color: #9ca3af;
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
