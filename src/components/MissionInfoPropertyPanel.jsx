// src/components/MissionInfoPropertyPanel.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCustomPropertyTab } from "../hooks/useCustomPropertyTab";

export default function MissionInfoPropertyPanel() {
  const { selected } = useCustomPropertyTab({
    key: "missionHelper",
    label: "미션 정보",
  });

  const [contentRoot, setContentRoot] = useState(null);

  // propertyContent를 찾을 때까지 폴링
  useEffect(() => {
    let destroyed = false;

    function tryFind() {
      const el = document.querySelector(".propertyContent");
      if (el && !destroyed) {
        setContentRoot(el);
        return true;
      }
      return false;
    }

    if (tryFind()) return undefined;

    const interval = setInterval(() => {
      if (tryFind()) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      destroyed = true;
      clearInterval(interval);
    };
  }, []);

  // 선택 여부에 따라 기존 내용 숨기기 / 배경색 토글
  useEffect(() => {
    if (!contentRoot) return;

    // 배경색
    contentRoot.style.backgroundColor = selected ? "#ecf8ff" : "";

    // .propertyContent 직속 자식들 중,
    // 우리 패널(div[data-mission-panel="true"]) 빼고 전부 hide
    const children = Array.from(contentRoot.children);
    children.forEach((child) => {
      if (!(child instanceof HTMLElement)) return;

      const isOurPanel = child.dataset.missionPanel === "true";

      if (selected) {
        // custom 탭일 때: 우리 패널만 보이고 나머지는 숨김
        child.style.display = isOurPanel ? "" : "none";
      } else {
        // 다른 탭일 때: 우리 패널 숨기고 나머지 원상복구
        child.style.display = isOurPanel ? "none" : "";
      }
    });
  }, [selected, contentRoot]);

  // 선택 안됐거나 아직 루트를 못 찾았으면 렌더 안 함
  if (!selected || !contentRoot) return null;

  return createPortal(
    <div
      className="missionInfoPanelWrapper"
      data-mission-panel="true" // ← 이걸로 위에서 우리 패널만 예외 처리
    >
      <div className="missionInfoPanelContentWorkspace">
        <h4 style={{ marginBottom: 8 }}>미션 정보</h4>
        <p style={{ marginBottom: 4 }}>
          여기 안에 미션 제목 / 난이도 / 설명 / 힌트등 삽입
        </p>

        <div style={{ marginTop: 12 }}>
          <div>...</div>
          <div>...</div>
        </div>
      </div>
    </div>,
    contentRoot
  );
}
