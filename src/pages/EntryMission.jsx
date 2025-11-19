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
import TestButton from "../components/TestButton.jsx";
import EntryDomPortal from "../components/EntryDomPortal.jsx";

// 실행이 끝난 "마지막 블록" 시점을 잡는 훅
function attachLastBlockExecutedHook(Entry) {
  if (!Entry || !Entry.Executor) {
    console.warn("[Entry Hook] Entry.Executor 를 찾지 못했습니다.");
    return;
  }

  const proto = Entry.Executor.prototype;

  // 중복 패치 방지
  if (proto._patchedForLastBlockEvent) {
    return;
  }

  const originalExecute = proto.execute;

  proto.execute = function(isFromOrigin) {
    // 원래 동작 그대로 수행
    const result = originalExecute.call(this, isFromOrigin);

    try {
      // 💡 Executor.execute()가 "끝까지 실행된 경우" 배열을 리턴함
      //   - 중간 실행: { promises, blocks } 형태
      //   - 완전히 끝난 실행: [ block1, block2, ..., lastBlock ]
      if (Array.isArray(result) && result.length > 0) {
        const lastBlock = result[result.length - 1];
        const lastBlockView =
          lastBlock && lastBlock.view ? lastBlock.view : null;

        // 엔트리 내부용 이벤트 (쓰고 싶으면 사용)
        if (Entry && Entry.dispatchEvent) {
          Entry.dispatchEvent("lastBlockExecute", lastBlockView);
        }

        // React / 외부에서 듣기 위한 브라우저 이벤트
        window.dispatchEvent(
          new CustomEvent("entry:lastBlockExecuted", {
            detail: {
              block: lastBlock,
              blockView: lastBlockView,
              executorId: this.id,
            },
          })
        );
      }
    } catch (e) {
      console.warn("[Entry Hook] lastBlockExecuted 처리 중 오류:", e);
    }

    return result;
  };

  proto._patchedForLastBlockEvent = true;
  console.log("[Entry Hook] Executor.execute 패치 완료 (lastBlockExecuted)");
}

// 실행 중인 블록 하이라이트 훅
function attachBlockExecuteHighlight(Entry) {
  if (!Entry || typeof Entry.addEventListener !== "function") {
    console.warn("[Entry Hook] Entry 또는 Entry.addEventListener 없음");
    return;
  }

  let lastBlockView = null;

  function addHighlight(blockView) {
    // 엔트리 BlockView의 SVG 그룹에 클래스 추가
    if (blockView && blockView.svgGroup && blockView.svgGroup.addClass) {
      blockView.svgGroup.addClass("entry-executing-highlight");
    }
  }

  function removeHighlight(blockView) {
    if (blockView && blockView.svgGroup && blockView.svgGroup.removeClass) {
      blockView.svgGroup.removeClass("entry-executing-highlight");
    }
  }

  // 이미 한 번 붙였으면 두 번 안 붙이도록 플래그
  if (Entry._patchedForExecuteHighlight) {
    return;
  }
  Entry._patchedForExecuteHighlight = true;

  Entry.addEventListener("blockExecute", (blockView) => {
    if (!blockView) return;
    if (lastBlockView && lastBlockView !== blockView) {
      removeHighlight(lastBlockView);
    }
    lastBlockView = blockView;
    addHighlight(blockView);
  });

  Entry.addEventListener("blockExecuteEnd", (blockView) => {
    if (!blockView) return;
    removeHighlight(blockView);
    if (lastBlockView === blockView) {
      lastBlockView = null;
    }
  });

  console.log("[Entry Hook] 실행 중 블록 하이라이트 이벤트 연결 완료");
}

// Entry가 로드된 뒤 블록 선택 훅을 거는 함수
function attachBlockSelectHook(Entry) {
  if (!Entry || !Entry.Board || !Entry.BlockView) {
    console.warn(
      "[Entry Hook] Entry.Board 또는 Entry.BlockView를 찾지 못했습니다."
    );
    return;
  }

  const proto = Entry.Board.prototype;

  // 중복 패치 방지
  if (proto._patchedForSelectHook) {
    return;
  }

  const original = proto.setSelectedBlock;

  proto.setSelectedBlock = function(blockView) {
    // 원래 동작(선택/하이라이트)은 그대로 유지
    original.call(this, blockView);

    // 선택된 블록이 BlockView 인스턴스일 때만 처리
    if (blockView instanceof Entry.BlockView) {
      // BlockView 안에 실제 Block 모델이 어디 달려있는지는 버전에 따라 다를 수 있음 → 방어적으로 접근
      const rawBlock =
        blockView.block || blockView._block || blockView.model || null;

      let blockData = null;

      if (rawBlock) {
        // toJSON이 있으면 그걸로 현재 상태를 가져오는 게 가장 안전함
        if (typeof rawBlock.toJSON === "function") {
          blockData = rawBlock.toJSON();
        } else if (rawBlock.schema) {
          // toJSON이 없으면 schema + 현재 필드를 대략 묶어서 찍을 수도 있음 (필요시 확장)
          blockData = {
            ...rawBlock.schema,
            id: rawBlock.id ?? rawBlock.schema.id,
            x: rawBlock.x ?? rawBlock.schema.x,
            y: rawBlock.y ?? rawBlock.schema.y,
            type: rawBlock.type ?? rawBlock.schema.type,
            params: rawBlock.params ?? rawBlock.schema.params,
            statements: rawBlock.statements ?? rawBlock.schema.statements,
          };
        } else {
          // 최악의 경우 rawBlock 자체를 덤프
          blockData = rawBlock;
        }
      }

      // 콘솔에 선택된 블록 정보 출력
      // console.log("[Entry] 선택된 BlockView:", blockView);
      //console.log("[Entry] 선택된 Block 데이터:", blockData);

      // React 쪽에서 듣고 싶으면 커스텀 이벤트로 던질 수 있음
      window.dispatchEvent(
        new CustomEvent("entry:blockSelected", {
          detail: {
            // blockView,
            block: blockData,
          },
        })
      );
    }
  };

  proto._patchedForSelectHook = true;
  console.log("[Entry Hook] Board.setSelectedBlock 패치 완료");
}

export default function EntryMission() {
  const [searchParams] = useSearchParams();
  const missionId = searchParams.get("missionId");

  // 백엔드에서 projectData 받아오기
  const {
    projectData,
    loading: projectLoading,
    error: projectError,
  } = useEntryProjectLoader({ missionId });

  const containerRef = useRef(null);
  const [selectedBlockData, setSelectedBlockData] = useState();
  const [entryInitialized, setEntryInitialized] = useState(false);

  useHeadLinks(CSS_LINKS);

  const status = useScriptsSequential(SCRIPT_URLS_IN_ORDER, {
    async: false,
    defer: false,
    removeOnUnmount: false,
  });

  // Entry 스크립트 로딩 완료 후, 한 번만 init + 훅 연결
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

      // 마지막 블록 실행 훅 연결
      attachLastBlockExecutedHook(Entry);

      // 블록 선택 훅 연결
      attachBlockSelectHook(Entry);

      // 실행 중인 블록 하이라이트 훅 연결
      attachBlockExecuteHighlight(Entry);

      setEntryInitialized(true);
    } catch (e) {
      console.error("Entry.init 실패:", e);
    }

    return () => {
      try {
        // Entry.destroy?.();
      } catch {}
    };
  }, [status]);

  // projectData가 바뀔 때마다 Entry 프로젝트 갱신
  useEffect(() => {
    if (!entryInitialized) return;
    if (!projectData) return;
    if (!window.Entry) return;

    try {
      console.log("[Entry] projectData 갱신, clearProject + loadProject 실행");
      window.Entry.clearProject();
      window.Entry.loadProject(projectData);
    } catch (e) {
      console.error("Entry 프로젝트 로드 중 오류:", e);
    }
  }, [entryInitialized, projectData]);

  // 선택된 블록 이벤트를 React 쪽에서 바로 보고 싶다면 (옵션)
  useEffect(() => {
    const handler = (e) => {
      console.log("[React] entry:blockSelected 이벤트 수신:", e.detail);
      // 여기서 e.detail.block 을 ChatWindow 쪽으로 넘기거나 Zustand에 저장해도 됨

      if (window.Entry) {
        const parser = new window.Entry.BlockToPyParser();
        const entryObject = window.Entry.playground.object;
        if (!entryObject || !entryObject.script) {
          console.warn("No script found");
          return;
        }
        const pyCode = parser.Code(
          entryObject.script,
          window.Entry.Parser.PARSE_GENERAL
        );
        console.log("=== PYTHON 코드 ===");
        console.log(pyCode);
      }

      setSelectedBlockData(e.detail);
    };

    window.addEventListener("entry:blockSelected", handler);
    return () => window.removeEventListener("entry:blockSelected", handler);
  }, []);

  useEffect(() => {
    console.log(selectedBlockData);
  }, [selectedBlockData]);

  const handleTestButtonClick = async () => {
    console.log("테스트 버튼 클릭!");

    const current = window.Entry.exportProject();
    console.log("현재 프로젝트: ", current);

    try {
      const res = await fetch(`/mocks/test2.json`);

      if (!res.ok) {
        console.error("Failed to load project: ", res.status);
        return;
      }

      const project = await res.json();
      console.log("로드할 프로젝트:", project);

      // Entry에 주입
      window.Entry.clearProject();
      window.Entry.loadProject(project);
      console.log("프로젝트 로드 완료!");
    } catch (err) {
      console.error("프로젝트 로드 중 오류:", err);
    }
  };

  if (status === "loading") return <div>Entry 리소스 로딩 중…</div>;
  if (status === "error") return <div>리소스 로드 실패</div>;

  return (
    <Layout>
      <EntryPane>
        {/* 엔트리가 이 div를 가득 채웁니다 */}
        <div ref={containerRef} />
      </EntryPane>

      <ChatPane>
        <ChatWindow missionId={missionId} />
      </ChatPane>

      {/*<TestButton
        label="코드 반영 테스트 버튼"
        onClick={handleTestButtonClick}
      />*/}
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

  @media (max-width: 900px) {
    /* 좁을 땐 전체 폭 사용 (뒤에 ChatPane이 겹쳐 올라오니까) */
    flex: 1 1 auto;
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
  padding: 12px;
  z-index: 100; /* 혹시라도 z축에서 EntryPane 뒤로 들어가는 일 방지 */

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
