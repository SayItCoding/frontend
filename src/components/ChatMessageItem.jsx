import styled, { css, keyframes } from "styled-components";

export function ChatMessageItem({ msg, onClick, selected }) {
  const isMe = msg.role === "user";
  const isErr = msg.role === "error";

  const clickable =
    !!msg.missionCodeId && // missionCodeId 있을 때만
    !msg.streaming &&
    !isErr;

  const handleClick = () => {
    if (!clickable) return;
    if (onClick) {
      onClick(msg);
    }
  };

  return (
    <Row $me={isMe}>
      <Bubble
        $me={isMe}
        $error={isErr}
        $clickable={clickable}
        $selected={selected}
        aria-live={msg.streaming ? "polite" : undefined}
        onClick={handleClick}
      >
        <Content>
          {msg.content}
          {msg.streaming && <Cursor> ▋</Cursor>}
        </Content>

        {msg.error && <ErrorText>에러: {msg.error}</ErrorText>}

        {clickable && <MetaText>이 시점 코드 보기</MetaText>}
      </Bubble>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  justify-content: ${(p) => (p.$me ? "flex-end" : "flex-start")};
  margin: 12px 0;
`;

const MetaText = styled.div`
  margin-top: 4px;
  font-size: 11px;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transition: opacity 0.15s ease, max-height 0.15s ease;
  color: #4b5563; /* 살짝 흐린 회색 */
  text-align: right;
`;

const Bubble = styled.div`
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 14px;
  line-height: 1.4;
  transition: all 0.18s ease;
  white-space: pre-wrap;
  word-break: break-word;

  /* 기본 배경 */
  ${(p) =>
    p.$me
      ? css`
          background: #2b65f5;
          color: #fff;
          border-bottom-right-radius: 4px;
        `
      : css`
          background: #fff;
          border: 1px solid #e5e7eb;
          border-bottom-left-radius: 4px;
        `}

  /* 에러 스타일 */
  ${(p) =>
    p.$error &&
    css`
      background: #ffecec;
      border-color: #ffbcbc;
      color: #b00020;
    `}

  /* 선택된 버블 강조 (missionCodeId 선택됨) */
   ${(p) =>
     p.$selected &&
     css`
       border-color: #2563eb !important;
       box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
     `}

  /* 클릭 가능한 버블 */
  ${(p) =>
    p.$clickable &&
    css`
      cursor: pointer;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.3);
      }

      &:hover ${MetaText} {
        opacity: 1;
        max-height: 20px;
      }
    `}
`;

const Content = styled.div`
  display: inline;
`;

const blink = keyframes`
0% { opacity: .4 }
50% { opacity: 1 }
100% { opacity: .4 }
`;

const Cursor = styled.span`
  animation: ${blink} 1s infinite;
`;

const ErrorText = styled.div`
  margin-top: 6px;
  font-size: 12px;
`;
