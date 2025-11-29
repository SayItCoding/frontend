// src/pages/EntryScreen.jsx
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import styled from "styled-components";
import { useEntryProjectLoader } from "../hooks/useEntryProjectLoader";
import { useHeadLinks } from "../hooks/useHeadLinks.js";
import { useScriptsSequential } from "../hooks/useScriptsSequential.js";
import {
  CSS_LINKS,
  SCRIPT_URLS_IN_ORDER,
} from "../constants/entryResources.js";
import ChatWindow from "../components/ChatWindow.jsx";
import MissionResultModal from "../components/MissionResultModal.jsx";
import MissionInfoPropertyPanel from "../components/MissionInfoPropertyPanel.jsx";

import {
  useEntryBlockHighlight,
  useEntryRunEndBySilence,
  useEntrySelectedBlock,
  useMissionResultEvents,
} from "../hooks/useEntryRuntimeListeners.js";

export default function EntryMission() {
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("missionId");
  const [entryInit, setEntryInit] = useState(false);
  const [result, setResult] = useState(null); // "success" | "fail" | null
  const resultRef = useRef(null);
  const containerRef = useRef(null);

  useHeadLinks(CSS_LINKS);
  const status = useScriptsSequential(SCRIPT_URLS_IN_ORDER, {
    async: false,
    defer: false,
    removeOnUnmount: false,
  });

  // 백엔드에서 projectData 받아오기
  const {
    mission, // 백엔드로 부터 받은 mission 상세 조회 api
    projectData,
    projectLoading,
    projectError,
  } = useEntryProjectLoader({
    missionId,
  });

  // result가 바뀔 때마다 ref에 반영
  useEffect(() => {
    resultRef.current = result;
  }, [result]);

  useEffect(() => {
    if (status !== "ready") return;
    if (!window.Entry || !containerRef.current) return;

    const Entry = window.Entry;
    const container = containerRef.current;
    container.id = "entryContainer";

    const initOption = {
      type: "workspace",
      libDir: "/libs",
      entryDir: "/entry",
      defaultDir: "/entry",
      textCodingEnable: true,
    };

    try {
      Entry.init(container, initOption);
      //Entry.propertyPanel.select("helper");
      Entry.playground.blockMenu.toggleBlockMenu();

      setEntryInit(true);
    } catch (e) {
      console.error("Entry.init 실패:", e);
    }

    return () => {
      try {
        const Entry = window.Entry;

        // 가능하면 엔트리도 정리 (버전에 따라 없을 수 있어서 옵션 호출)
        if (Entry && typeof Entry.clearProject === "function") {
          Entry.clearProject();
        }
      } catch (e) {
        console.warn("Entry cleanup 중 오류:", e);
      } finally {
        setEntryInit(false);

        // 여기서 body / html 전역 스타일 리셋
        const body = document.body;
        const html = document.documentElement;

        if (body) {
          body.style.overflow = "auto";
          body.style.position = "";
          body.style.height = "";
          body.style.touchAction = "";
        }

        if (html) {
          html.style.overflow = "auto";
          html.style.position = "";
          html.style.height = "";
        }
      }
    };
  }, [status]);

  // 실행 블록 하이라이트
  useEntryBlockHighlight({
    enabled: entryInit,
    // TODO: 실제 마지막 블록 ID를 mission에서 받는다면 그 값 사용
    lastBlockId: "z1wq",
  });

  // 실행 종료 감지 (idle 기반)
  useEntryRunEndBySilence({
    enabled: entryInit,
    idleMs: 300,
    resultRef,
    setResult,
  });

  // goal / outOfMap 커스텀 이벤트 → result 반영
  useMissionResultEvents({ setResult, resultRef });

  // selectedBlock 폴링 감지
  const selectedBlock = useEntrySelectedBlock(entryInit);

  // projectData가 바뀔 때마다 Entry 프로젝트 갱신
  useEffect(() => {
    if (!entryInit) return;
    if (!window.Entry) return;
    if (!projectData) return;
    if (projectLoading) return;

    try {
      //console.log("[Entry] projectData 갱신, clearProject + loadProject 실행");
      window.Entry.clearProject();
      window.Entry.loadProject(projectData);
    } catch (e) {
      console.error("Entry 프로젝트 로드 중 오류:", e);
    }
  }, [entryInit, projectLoading, projectData]);

  if (status === "loading") return <div>Entry 리소스 로딩 중…</div>;
  if (status === "error") return <div>리소스 로드 실패</div>;

  return (
    <Layout>
      <EntryPane>
        {/* 엔트리가 이 div를 가득 채웁니다 */}
        <div ref={containerRef} />
        <MissionInfoPropertyPanel />
      </EntryPane>

      <ChatPane>
        {!projectLoading && (
          <ChatWindow
            missionId={missionId}
            selectedBlock={selectedBlock}
            mission={mission}
          />
        )}
      </ChatPane>

      {/* 미션 결과 모달 */}
      <MissionResultModal
        open={result !== null}
        type={result === "success" ? "success" : "fail"}
        onClose={() => setResult(null)}
        onRetry={
          result === "fail"
            ? () => {
                // 실패 후 다시 도전: 모달 닫고, 필요하면 Entry 코드/상태 초기화
                setResult(null);
              }
            : undefined
        }
        onNext={
          result === "success"
            ? () => {
                // TODO: 성공 후 다음미션으로 or 홈페이지
                setResult(null);
              }
            : undefined
        }
      />
    </Layout>
  );
}

const Layout = styled.div`
  position: relative;
  display: flex;
  width: 100vw;
  height: 100vh; /* 전체 화면 덮기 */
  overflow: hidden; /* 내부에서만 스크롤 */
  background: #f5f6f8;
`;

const EntryPane = styled.div`
  flex: 7 1 0;
  min-width: 0; /* flex overflow 방지 */
  background: #fff;
  position: relative;

  /* 엔트리 컨테이너가 Pane을 가득 채우도록 */
  #entryContainer {
    position: absolute;
    inset: 0; /* top:0; right:0; bottom:0; left:0 */
  }
`;

const ChatPane = styled.aside`
  /* 넓을 때: EntryPane과 나란히 3 비율로, 겹치지 않게 */
  flex: 3 1 0;
  height: 100%;
  border-left: 1px solid #eaeaea;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 8px;
  z-index: 1000; /* 혹시라도 z축에서 EntryPane 뒤로 들어가는 일 방지 */

  & > * {
    width: 100%;
    height: 100%;
  }

  /* 좁을 때(모바일 등): 아래에서 위로 올라타는 오버레이 레이아웃 */
  @media (max-width: 900px) {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    width: 100vw;
    height: 45vh;
    border-left: none;
    border-top: 1px solid #eaeaea;
    padding: 8px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: saturate(1.1) blur(2px);
  }
`;
