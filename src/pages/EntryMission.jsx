// src/pages/EntryScreen.jsx
import React, { useState, useEffect, useRef } from "react";

import styled from "styled-components";
import { useHeadLinks } from "../hooks/useHeadLinks.js";
import { useScriptsSequential } from "../hooks/useScriptsSequential.js";
import {
  CSS_LINKS,
  SCRIPT_URLS_IN_ORDER,
} from "../constants/entryResources.js";
import ChatWindow from "../components/ChatWindow.jsx";
import TestButton from "../components/TestButton.jsx";
import EntryDomPortal from "../components/EntryDomPortal.jsx";

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
  const [selectedBlockData, setSelectedBlockData] = useState();
  const [currentMissionId, setCurrentMissionId] = useState(null);

  useHeadLinks(CSS_LINKS);

  const status = useScriptsSequential(SCRIPT_URLS_IN_ORDER, {
    async: false,
    defer: false,
    removeOnUnmount: false,
  });

  const containerRef = useRef(null);

  // === (1) 프로젝트 로더: URL → JSON → 경로보정 → loadProject ===
  async function loadMission() {
    console.log("loadMission 함수 실행 시작");
    /*
    const res = await fetch("/mocks/mission1.json"); // ← public/projects/mission1.json
    if (!res.ok) throw new Error(`mission1.json fetch 실패: ${res.status}`);
    const project = await res.json();
    */
    // 실제 미션 파일 경로로 변경
    // 미션 목록 조회 API 호출 시도해보기 (일단 page=1, limit=1로 첫 번째 ID만 가져옴)
    const listRes = await fetch("/api/v1/missions?page=1&limit=1");
    // 🚨 핵심 수정: 응답 본문을 먼저 한 번만 텍스트로 읽어옵니다.
    const rawResponseText = await listRes.text();
    //1 .ok 상태를 먼저 확인해야 합니다.
    if (!listRes.ok) {
      const errorText = await listRes.text();
      console.error(`미션 목록 API 실패: ${listRes.status}`, errorText);
      throw new Error(`미션 목록 조회 실패: ${listRes.status} ${errorText}`);
    }

    //2. 이제 안전하게 JSON 파싱을 시도합니다.
    let listData;
    try {
      listData = JSON.parse(rawResponseText);
    } catch (e) {
    // .ok 상태는 통과했지만, 응답 내용이 잘못되었을 때만 처리
    console.error("목록 응답 JSON 파싱 실패:", rawResponseText, e);
    throw new Error("미션 목록 API에서 유효한 JSON을 받지 못했습니다.");
    }
  
    //const listData = await listRes.json();
    const missions = listData?.items || [];

    if (missions.length === 0) {
      console.warn("현재 서버에 유효한 미션이 없습니다.");
      return;
    }
    const missionId = missions[0].id; // 첫 번째 미션의 ID 획득
    // 획득한 ID를 상태에 저장
    setCurrentMissionId(missionId);
    console.log(`[Entry] 유효한 missionId 획득: ${missionId}`);

    // 2. 획득한 ID로 미션 상세 조회 API 호출 (명세: /api/v1/missions/{missionId})
    // 이 API가 Entry가 사용할 프로젝트 JSON 데이터를 반환한다고 가정합니다.
    const projectRes = await fetch(`/api/v1/missions/${missionId}`); 
  
    if (!projectRes.ok) throw new Error(`미션 상세 JSON fetch 실패: ${projectRes.status}`);
  
    // 백엔드에서 반환하는 JSON 응답이 Entry가 요구하는 프로젝트 형식이라고 가정
    const project = await projectRes.json();
    // 파일 경로 보정
    const mapPath = (url = "") => {
      if (url.startsWith("./bower_components/entry-js/images/")) {
        // "./bower_components/entry-js/images/xxx" -> "/entry/images/xxx"
        return "/entry/images/" + url.split("/images/")[1];
      }
      if (url.startsWith("temp/")) {
        // "temp/..." -> "/entry/temp/..."
        return "/entry/" + url;
      }
      return url;
    };

    // pictures/sounds의 fileurl, thumbUrl 보정
    for (const obj of project.objects || []) {
      const pics = obj?.sprite?.pictures || [];
      for (const p of pics) {
        if (p.fileurl) p.fileurl = mapPath(p.fileurl);
        if (p.thumbUrl) p.thumbUrl = mapPath(p.thumbUrl);
      }
      const snds = obj?.sprite?.sounds || [];
      for (const s of snds) {
        if (s.fileurl) s.fileurl = mapPath(s.fileurl);
      }
    }

    // JSON 객체를 그대로 주입
    window.Entry.loadProject(project);
  }

  useEffect(() => {
    const h = (e) => {
      console.error("[window.onerror]", e.filename || e.message, e);
    };
    window.addEventListener("error", h);
    return () => window.removeEventListener("error", h);
  }, []);

  // === (3) Entry 초기화 및 미션 로드 용도
  useEffect(() => {
    //loadmission 호출해서 api 작동하는지 확인하려고 밑에 2줄 일시적으로 주석처리, 나중에 주석없애기
    if (status !== "ready") return;
    if (!window.Entry || !containerRef.current) return;
    console.log("Entry 초기화 및 로드 로직 시작");

    const Entry = window.Entry;
    const container = containerRef.current;

    // 👇 핵심 해결책: Entry와 containerRef.current 모두 null이 아닌지 확인
    if (!Entry || !container) {
        // 둘 중 하나라도 없으면 이번 렌더링 주기는 건너뛰고 다음 렌더링을 기다림
        console.warn("Entry 객체 또는 컨테이너 DOM이 아직 준비되지 않음 (SKIP)");
        return; 
    }

    container.id = "entryContainer";

    // ← 절대경로 + 끝에 슬래시 권장
    const initOption = {
      type: "workspace",
      libDir: "/libs",
      entryDir: "/entry",
      defaultDir: "/entry",
      textCodingEnable: true,
    };

    try {
      Entry.init(container, initOption);

      // 블록 선택 훅 연결
      attachBlockSelectHook(Entry);

      // (2) init 직후 실제 JSON 로드 호출
      requestAnimationFrame(() => {
        loadMission().catch((e) => {
          console.warn("mission 로드 실패:", e);
        });
      });
    } catch (e) {
      console.error("Entry.init 실패:", e);
    }

    return () => {
      try {
        // Entry.destroy?.();
      } catch {}
    };
  }, [status]);

  // 선택된 블록 이벤트를 React 쪽에서 바로 보고 싶다면 (옵션)
  useEffect(() => {
    const handler = (e) => {
      console.log("[React] entry:blockSelected 이벤트 수신:", e.detail);
      // 여기서 e.detail.block 을 ChatWindow 쪽으로 넘기거나 Zustand에 저장해도 됨
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
      const res = await fetch(`/mocks/test1.json`);

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
        <ChatWindow />
      </ChatPane>
      <TestButton
        label="코드 반영 테스트 버튼"
        onClick={handleTestButtonClick}
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
