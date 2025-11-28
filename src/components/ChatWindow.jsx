import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ChatMessageList } from "./ChatMessageList.jsx";
import { ChatInputBar } from "./ChatInputBar.jsx";
import { fetchMissionChats } from "../api/mission.js";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { sendMissionChat, fetchMissionCode } from "../api/mission.js";

/**
 * props:
 *  - missionId: number | string  (필수)
 */
export default function ChatWindow({
  missionId,
  selectedBlock,
  title = "Chat",
  mission,
}) {
  const [messages, setMessages] = useState([]); // 화면에 보여줄 메시지들
  const [selectedCodeId, setSelectedCodeId] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false); // 초기 히스토리 로딩용
  const [error, setError] = useState("");
  const [isResponding, setIsResponding] = useState(false); // API 응답 대기 중 여부

  // 최초 입장 시 기존 대화 내역 로딩
  useEffect(() => {
    if (!missionId) return;

    async function loadChats() {
      try {
        setLoadingHistory(true);
        setError("");

        const data = await fetchMissionChats(missionId, 1, 30);
        const items = data.items || [];

        const mapped = items
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) // 오래된 순 정렬
          .map((c) => ({
            id: c.id,
            missionCodeId: c.missionCodeId ?? null,
            role: c.role, // 'user' | 'assistant'
            content: c.content,
            createdAt: c.createdAt,
          }));

        setMessages(mapped);
      } catch (err) {
        console.error("미션 대화 내역 조회 실패:", err);
        setError("대화 내역을 불러오지 못했습니다.");
      } finally {
        setLoadingHistory(false);
      }
    }

    loadChats();
  }, [missionId]);

  // 가장 최신 코드 반영
  useEffect(() => {
    if (messages.length === 0) return;

    // 뒤에서 앞으로 missionCodeId가 있는 메시지를 찾기
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].missionCodeId != null) {
        setSelectedCodeId(messages[i].missionCodeId);
        return;
      }
    }

    // 하나도 없으면 null
    setSelectedCodeId(null);
  }, [messages]);

  // assistant 말풍선에 글자를 한 글자씩 채워넣는 함수
  function typeAssistantMessage(tempId, fullText) {
    let index = 0;
    const speed = 20; // ms 단위 (작을수록 빨리 친다)

    const timer = setInterval(() => {
      index += 1;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === tempId
            ? {
                ...m,
                content: fullText.slice(0, index),
              }
            : m
        )
      );

      if (index >= fullText.length) {
        clearInterval(timer);
        // 다 타이핑되면 streaming 종료 + 로더 끔
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId
              ? {
                  ...m,
                  streaming: false,
                }
              : m
          )
        );
        setIsResponding(false);
      }
    }, speed);
  }

  const handleSend = async (userText) => {
    const trimmed = userText.trim();
    if (!trimmed) return;

    const now = new Date().toISOString();

    // 사용자 메시지 즉시 추가
    const userMsg = {
      id: `user-${Date.now()}`,
      missionCodeId: null, // 나중에 응답 후 붙임
      role: "user",
      content: trimmed,
      createdAt: now,
    };

    // assistant 로더용 말풍선 추가 (text 비워두고 streaming만 true)
    const tempAssistantId = `assistant-temp-${Date.now()}`;
    const tempAssistantMsg = {
      id: tempAssistantId,
      missionCodeId: null, // 나중에 응답 후 붙임
      role: "assistant",
      content: "",
      streaming: true, // ChatMessageItem에서 커서 깜빡임
      createdAt: now,
    };

    setMessages((prev) => [...prev, userMsg, tempAssistantMsg]);
    setIsResponding(true);

    try {
      // 현재 선택된 코드 기준으로 코드 작성 및 수정 요청
      const data = await sendMissionChat(missionId, trimmed, selectedCodeId);
      const items = data.items || [];

      // 응답 중 assistant 역할인 것만 사용
      const assistant = items.find((it) => it.role === "assistant");
      if (!assistant) {
        // assistant가 없으면 로더 제거 + 에러 표시
        setMessages((prev) =>
          prev
            .filter((m) => m.id !== tempAssistantId)
            .concat({
              id: `err-${Date.now()}`,
              role: "error",
              content: "AI 응답을 받지 못했습니다.",
              error: "assistant message not found",
              createdAt: new Date().toISOString(),
            })
        );
        setIsResponding(false);
        return;
      }

      const fullText = assistant.content || "";

      // missionCodeId를 방금 user/assistant 메시지에 연결
      const missionCodeId = data.missionCodeId ?? null;
      if (missionCodeId !== null) {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id === userMsg.id || m.id === tempAssistantId) {
              return {
                ...m,
                missionCodeId,
              };
            }
            return m;
          })
        );
      }

      // fullText를 tempAssistantMsg에 "타자치는 것처럼" 채워넣기
      typeAssistantMessage(tempAssistantId, fullText);

      if (data.projectData) {
        try {
          console.log("코드 변경 프로젝트 로드");
          console.log(data.projectData);
          window.Entry.clearProject();
          window.Entry.loadProject(data.projectData);
        } catch (err) {
          console.error("프로젝트 로드 중 오류:", err);
        }
      }
    } catch (err) {
      console.error("❌ 채팅 전송/응답 실패:", err);

      // 실패 시: 로더 말풍선 제거하고 에러 메시지 추가
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== tempAssistantId)
          .concat({
            id: `err-${Date.now()}`,
            role: "error",
            content: "메시지 전송 중 오류가 발생했습니다.",
            error: err.message,
            createdAt: new Date().toISOString(),
          })
      );
      setIsResponding(false);
    }
  };

  const handleMessageClick = async (msg) => {
    if (!msg.missionCodeId) return;
    if (!missionId && missionId !== 0) return;
    if (msg.missionCodeId === selectedCodeId) return;

    setSelectedCodeId(msg.missionCodeId);

    try {
      const data = await fetchMissionCode(missionId, msg.missionCodeId);
      if (data?.projectData) {
        try {
          window.Entry?.clearProject();
          window.Entry?.loadProject(data.projectData);
        } catch (err) {
          console.error("프로젝트 로드 중 오류:", err);
        }
      }
    } catch (err) {
      console.error("❌ 코드 로드 실패:", err);
    }
  };

  return (
    <Wrap>
      <Head>{mission?.title && <span>{mission.title}</span>}</Head>

      {loadingHistory && <StatusText>이전 대화 내역을 불러오는 중…</StatusText>}
      {error && <StatusText>{error}</StatusText>}

      <ChatMessageList
        messages={messages}
        selectedCodeId={selectedCodeId}
        onMessageClick={handleMessageClick}
      />

      <ChatInputBar onSend={handleSend} selectedBlock={selectedBlock} />
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: min(100vh, 900px);
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

const StatusText = styled.div`
  font-size: 13px;
  color: #6b7280;
  padding: 8px 16px;
`;
