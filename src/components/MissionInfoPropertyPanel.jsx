// src/components/MissionInfoPropertyPanel.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { useCustomPropertyTab } from "../hooks/useCustomPropertyTab";

export default function MissionInfoPropertyPanel() {
  const { selected } = useCustomPropertyTab({
    key: "missionHelper",
    label: "미션 정보",
  });

  const BLOCK_HELP = [
    {
      id: "move_forward",
      label: "앞으로 가기",
      desc: "캐릭터가 바라보는 방향으로 한 칸 이동해요.",
    },
    {
      id: "turn_left",
      label: "왼쪽으로 돌기",
      desc: "캐릭터가 바라보는 방향 기준, 왼쪽으로 돌아요",
    },
    {
      id: "turn_right",
      label: "오른쪽으로 돌기",
      desc: "캐릭터가 바라보는 방향 기준, 오른쪽으로 돌아요",
    },
  ];

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
      <MissionInfoPanelContentWorkspace>
        <MissionHintNumber>목표</MissionHintNumber>

        <MissionHintContainer>
          <MissionHintTopDiv>
            <MissionHintTitle>
              캐릭터를 목표 지점까지 이동해볼까요?
            </MissionHintTitle>
            <MissionHintIndicator />
          </MissionHintTopDiv>
        </MissionHintContainer>
      </MissionInfoPanelContentWorkspace>

      {/* 아래: 사용할 수 있는 블록 안내 섹션 */}
      <BlockHelpSection>
        <BlockList>
          {BLOCK_HELP.map((b) => (
            <BlockItemRow key={b.id}>
              <BlockFigure>{b.label}</BlockFigure>
              <BlockDesc>{b.desc}</BlockDesc>
            </BlockItemRow>
          ))}
        </BlockList>
      </BlockHelpSection>
    </div>,
    contentRoot
  );
}

export const MissionInfoPanelContentWorkspace = styled.div`
  width: 95%;
  background-color: #ffffff;
  border-radius: 5px;
  margin: 7px auto 0;
  min-height: 80px;
  position: relative;
  height: auto;

  * {
    box-sizing: border-box;
    font-family: "Nanum Gothic", sans-serif;
  }
`;

export const MissionHintNumber = styled.div`
  display: inline-block;
  width: 52px;
  height: 52px;
  border-radius: 26px;
  background-color: #2ea1ff;
  color: #ffffff;
  margin-top: 14px;
  margin-left: 14px;
  text-align: center;
  font-size: 18px;
  line-height: 52px;
  padding: 2px 2px 0 0;
`;

export const MissionHintContainer = styled.span`
  vertical-align: top;
  display: inline-block;
  height: 100%;
  width: calc(100% - 80px);
  position: relative;
  left: 13px;
`;

export const MissionHintTopDiv = styled.div`
  margin-bottom: 4px;
`;

export const MissionHintTitle = styled.div`
  display: inline-block;
  font-size: 14px;
  padding-top: 20px;
  padding-bottom: 10px;
  padding-right: 10px;
  white-space: pre-line;
  color: #4f80ff;
`;
export const MissionHintIndicator = styled.span`
  display: inline-block;
`;

export const BlockHelpSection = styled.div`
  margin-top: 16px;
  padding: 12px 16px 16px;
  border-radius: 8px;
`;

export const BlockHelpTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #4a4a4a;
  margin-bottom: 12px;
`;

export const BlockList = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr; /* ← 왼쪽 블록 col 고정 */
  row-gap: 10px;
  column-gap: 12px;
  align-items: center;
`;

/* 보라색 블록 + 설명 한 줄 */
export const BlockItemRow = styled.div`
  display: contents;
`;

export const BlockFigure = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  min-width: 80px;

  background: rgb(173, 62, 251); /* fill */
  border: 1px solid rgb(139, 25, 219); /* stroke */
  color: #ffffff;

  border-radius: 999px; /* 완전 타원형 */
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
`;

/* 텍스트 설명 */
export const BlockDesc = styled.div`
  font-size: 14px;
  color: #555;
`;
