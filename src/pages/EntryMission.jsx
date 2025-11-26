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

// 실행 중인 블록 하이라이트 훅
function attachBlockExecuteHighlight(Entry, lastBlockId) {
  //console.log("[Hook] attachBlockExecuteHighlight 호출됨", Entry);

  if (!Entry || typeof Entry.addEventListener !== "function") {
    console.warn("[Hook] Entry 또는 Entry.addEventListener 없음");
    return;
  }

  let lastTarget = null; // 마지막으로 하이라이트한 <g>

  function clearHighlight() {
    if (lastTarget && lastTarget.classList) {
      lastTarget.classList.remove("entry-executing-highlight");
    }
    lastTarget = null;

    // 혹시 남아 있는 게 있으면 방어적으로 제거
    const remains = document.querySelectorAll("g.entry-executing-highlight");
    remains.forEach((el) => el.classList.remove("entry-executing-highlight"));
  }

  // blockView 안에서 block id 뽑기
  function getBlockIdFromView(blockView) {
    const id =
      blockView?.block?.data?.id ??
      blockView?.data?.id ??
      blockView?.id ??
      null;

    // console.log("[Hook] blockView id 추출:", id, blockView);
    return id;
  }

  // blockView → DOM에서 해당 블록의 <g> 찾아서 하이라이트
  function highlightBlockView(blockView) {
    const blockId = getBlockIdFromView(blockView);
    if (!blockId) {
      console.warn("[Hook] blockId 없음, 하이라이트 스킵");
      return;
    }

    // SVG 내에서 path.blockPath[blockId="..."] 찾기
    const path = document.querySelector(
      `svg path.blockPath[blockId="${blockId}"]`
    );

    // console.log("[Hook] 찾은 path:", path);

    if (!path) {
      console.warn(`[Hook] path.blockPath[blockId="${blockId}"] 를 찾지 못함`);
      return;
    }

    // 이 path가 들어있는 가장 가까운 g 하나를 "그 블록"으로 본다
    const g = path.closest("g");
    if (!g || !g.classList) {
      console.warn("[Hook] path.closest('g') 실패", path);
      return;
    }

    // 이전 하이라이트 제거 후 새로 적용
    clearHighlight();
    g.classList.add("entry-executing-highlight");
    lastTarget = g;

    // console.log("[Hook] highlight target g:", g);
  }

  // 중복 패치 방지 (원하면 유지, 개발 중엔 새로고침하면 리셋됨)
  if (Entry._patchedForExecuteHighlight) {
    // console.log("[Hook] 이미 패치되어 있음, 재등록 생략");
    return;
  }
  Entry._patchedForExecuteHighlight = true;

  // console.log("[Hook] blockExecute/stop 리스너 등록 시작");

  Entry.addEventListener("blockExecute", (blockView) => {
    // console.log("[blockExecute] 이벤트 발생! blockView:", blockView);
    highlightBlockView(blockView);
    if (blockView.data.id === lastBlockId) {
      console.log("마지막 블록 실행 완료");
    }
  });

  Entry.addEventListener("stop", () => {
    // console.log("[stop] 이벤트 발생! → 하이라이트 초기화");
    clearHighlight();
  });
}

export default function EntryMission() {
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("missionId");
  const [entryInit, setEntryInit] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const containerRef = useRef(null);

  useHeadLinks(CSS_LINKS);
  const status = useScriptsSequential(SCRIPT_URLS_IN_ORDER, {
    async: false,
    defer: false,
    removeOnUnmount: false,
  });

  // 백엔드에서 projectData 받아오기
  const { projectData, projectLoading, projectError } = useEntryProjectLoader({
    missionId,
  });

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
      Entry.propertyPanel.select("helper");
      Entry.playground.blockMenu.toggleBlockMenu();

      const lastBlockId = "z1wq";
      attachBlockExecuteHighlight(Entry, lastBlockId);

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

  // selectedBlock 폴링 감지
  useEffect(() => {
    // 마지막으로 감지한 선택 상태를 기억할 ref
    let lastSelectedId = null;

    const interval = setInterval(() => {
      // 1) svgBlockGroup 찾기
      let svgGroup = document.querySelectorAll("g.svgBlockGroup");
      svgGroup = svgGroup[1]; // 두 번째 요소
      if (!svgGroup) {
        // 엔트리 아직 안 떠 있으면 선택 없다고 처리
        if (lastSelectedId !== null) {
          lastSelectedId = null;
          setSelectedBlock(null);
        }
        return;
      }

      // 2) 선택된 블록 찾기: class="block selected"
      const selectedEl = svgGroup.querySelector(".block.selected");

      // 선택된 게 없으면
      if (!selectedEl) {
        if (lastSelectedId !== null) {
          lastSelectedId = null;
          setSelectedBlock(null);
        }
        return;
      }

      // 3) 선택된 블록의 id (또는 data-id) 가져오기
      const currentId =
        selectedEl.getAttribute("id") || selectedEl.dataset?.id || null;

      // 이전과 같으면 setSelectedBlock 아예 호출 안 함
      if (currentId === lastSelectedId) {
        return;
      }

      // 4) 이전과 다르면 상태 갱신
      lastSelectedId = currentId;

      // selectedBlock을 어떻게 쓸지에 따라 shape 조정
      setSelectedBlock(
        currentId
          ? {
              id: currentId,
              el: selectedEl, // 필요하면 DOM도 같이 전달
            }
          : null
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // projectData가 바뀔 때마다 Entry 프로젝트 갱신
  useEffect(() => {
    if (!entryInit) return;
    if (!window.Entry) return;
    if (!projectData) return;
    if (projectLoading) return;

    try {
      console.log("[Entry] projectData 갱신, clearProject + loadProject 실행");
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
      </EntryPane>

      <ChatPane>
        {!projectLoading && (
          <ChatWindow missionId={missionId} selectedBlock={selectedBlock} />
        )}
      </ChatPane>
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

const Divider = styled.div`
  width: 6px;
  cursor: col-resize;
  background: #e0e0e0;
  transition: background 0.2s;
  z-index: 10;

  &:hover {
    background: #c0c0c0;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;
