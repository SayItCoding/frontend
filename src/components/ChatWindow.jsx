import styled from "styled-components";
import { ChatMessageList } from "./ChatMessageList.jsx";
import { ChatInputBar } from "./ChatInputBar.jsx";

export default function ChatWindow() {
  return (
    <Wrap>
      <Head>
        <span>Chat</span>
      </Head>
      <ChatMessageList />
      <ChatInputBar />
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: min(80vh, 900px);
  width: min(900px, 100%);
  border: 1px solid #eaeaea;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
`;

const Head = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
