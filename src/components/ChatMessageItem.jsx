import styled, { css, keyframes } from "styled-components";

export function ChatMessageItem({ msg }) {
  const isMe = msg.role === "user";
  const isErr = msg.role === "error";
  return (
    <Row $me={isMe}>
      <Bubble
        $me={isMe}
        $error={isErr}
        aria-live={msg.streaming ? "polite" : undefined}
      >
        {msg.content}
        {/*msg.streaming && <Cursor> ▋</Cursor>*/}
        {msg.error && (
          <div style={{ marginTop: 6, fontSize: 12 }}>에러: {msg.error}</div>
        )}
      </Bubble>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  justify-content: ${(p) => (p.$me ? "flex-end" : "flex-start")};
  margin: 6px 0;
`;

const Bubble = styled.div`
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  ${(p) =>
    p.$me
      ? css`
          background: #2b65f5;
          color: #fff;
          border-bottom-right-radius: 4px;
        `
      : css`
          background: #fff;
          border: 1px solid #eaeaea;
          border-bottom-left-radius: 4px;
        `}
  ${(p) =>
    p.$error &&
    css`
      background: #ffecec;
      border-color: #ffbcbc;
      color: #b00020;
    `}
`;
/*streaming 말고 api로 메시지 와서 제거
const blink = keyframes`
0% { opacity: .4 }
50% { opacity: 1 }
100% { opacity: .4 }
`;

const Cursor = styled.span`
  animation: ${blink} 1s infinite;
`;
*/
