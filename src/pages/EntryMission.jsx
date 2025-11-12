// src/pages/EntryScreen.jsx
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useHeadLinks } from "../hooks/useHeadLinks.js";
import { useScriptsSequential } from "../hooks/useScriptsSequential.js";
import {
  CSS_LINKS,
  SCRIPT_URLS_IN_ORDER,
} from "../constants/entryResources.js";
import ChatWindow from "../components/ChatWindow.jsx";

export default function EntryMission() {
  useHeadLinks(CSS_LINKS);

  const status = useScriptsSequential(SCRIPT_URLS_IN_ORDER, {
    async: false,
    defer: false,
    removeOnUnmount: false,
  });

  const containerRef = useRef(null);

  // === (1) 프로젝트 로더: URL → JSON → 경로보정 → loadProject ===
  async function loadMission() {
    const res = await fetch("/mocks/mission1.json"); // ← public/projects/mission1.json
    if (!res.ok) throw new Error(`mission1.json fetch 실패: ${res.status}`);
    const project = await res.json();

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

  useEffect(() => {
    if (status !== "ready") return;
    if (!window.Entry || !containerRef.current) return;

    const Entry = window.Entry;
    const container = containerRef.current;
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
    </Layout>
  );
}

const Layout = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh; /* 전체 화면 덮기 */
  overflow: hidden; /* 내부에서만 스크롤 */
  background: #f5f6f8;
`;

const EntryPane = styled.div`
  flex: 1 1 auto; /* 가능한 공간 모두 차지 */
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
  width: min(600px, 45vw);
  min-width: 340px;
  height: 100%;
  border-left: 1px solid #eaeaea;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: stretch;
  padding: 12px;

  /* 내부에서 ChatWindow가 꽉 차도록 */
  & > * {
    width: 100%;
    height: 100%;
  }

  /* 좁은 화면에서 아래로 내리기 (옵션) */
  @media (max-width: 900px) {
    position: absolute;
    right: 0;
    bottom: 0;
    top: auto;
    width: 100vw;
    height: 45vh;
    border-left: none;
    border-top: 1px solid #eaeaea;
    padding: 8px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: saturate(1.1) blur(2px);
  }
`;
