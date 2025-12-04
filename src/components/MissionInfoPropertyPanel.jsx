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
      bg: "#ad3efb",
      border: "rgb(139, 25, 219)",
      color: "#FFFFFF",
    },
    {
      id: "turn_left",
      label: "왼쪽으로 돌기",
      desc: "캐릭터가 바라보는 방향 기준, 왼쪽으로 돌아요",
      bg: "#ad3efb",
      border: "rgb(139, 25, 219)",
      color: "#FFFFFF",
    },
    {
      id: "turn_right",
      label: "오른쪽으로 돌기",
      desc: "캐릭터가 바라보는 방향 기준, 오른쪽으로 돌아요",
      bg: "#ad3efb",
      border: "rgb(139, 25, 219)",
      color: "#FFFFFF",
    },
    {
      id: "repeat_basic",
      label: "~번 반복하기",
      desc: "위의 행동들 중에서 원하는만큼 반복해요",
      bg: "#16baea",
      border: "rgb(20, 152, 192)",
      color: "#FFFFFF",
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
    <div className="missionInfoPanelWrapper" data-mission-panel="true">
      <MissionInfoPanelContentWorkspace>
        <MissionHintNumber>목표</MissionHintNumber>

        <MissionHintContainer>
          <MissionHintTitle>
            캐릭터가 목표까지 도달할 수 있도록, 아래 블록들만 사용해서 움직임
            순서를 만들어 볼까요?
          </MissionHintTitle>
        </MissionHintContainer>
      </MissionInfoPanelContentWorkspace>

      {/* 아래: 사용할 수 있는 블록 안내 섹션 */}
      <BlockHelpSection>
        <BlockHelpTitle>사용할 수 있는 블록</BlockHelpTitle>
        <BlockHelpSubText></BlockHelpSubText>

        <BlockList>
          {BLOCK_HELP.map((b) => (
            <BlockItemRow key={b.id}>
              <BlockFigure $bg={b.bg} $border={b.border} $color={b.color}>
                {b.label}
              </BlockFigure>
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
  border-radius: 12px;
  margin: 10px auto 0;
  min-height: 80px;
  position: relative;
  padding-bottom: 12px;

  * {
    box-sizing: border-box;
    font-family: "Nanum Gothic", sans-serif;
  }
`;

export const MissionHintNumber = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: linear-gradient(135deg, #2ea1ff, #4f80ff);
  color: #ffffff;
  margin-top: 16px;
  margin-left: 16px;
  font-size: 18px;
  font-weight: 700;
`;

export const MissionHintContainer = styled.span`
  vertical-align: top;
  display: inline-block;
  height: 100%;
  width: calc(100% - 90px);
  position: relative;
  left: 14px;
`;

export const MissionHintTitle = styled.div`
  display: inline-block;
  font-size: 14px;
  padding-top: 18px;
  padding-bottom: 8px;
  padding-right: 10px;
  white-space: pre-line;
  color: #2f4f90;
  font-weight: 600;
`;

export const BlockHelpSection = styled.div`
  margin-top: 16px;
  padding: 14px 16px 18px;
  border-radius: 12px;
`;

export const BlockHelpTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #244872;
  margin-bottom: 4px;
`;

export const BlockHelpSubText = styled.div`
  font-size: 12px;
  color: #60738b;
  margin-bottom: 10px;
`;

export const BlockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 한 줄 카드
export const BlockItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
`;

// 왼쪽 pill
export const BlockFigure = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  min-width: 88px;

  background: ${(props) => props.$bg ?? "rgb(173, 62, 251)"};
  border: 1px solid ${(props) => props.$border ?? "rgb(139, 25, 219)"};
  color: ${(props) => props.$color ?? "#ffffff"};

  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
`;

// 설명 텍스트
export const BlockDesc = styled.div`
  margin-left: 10px;
  font-size: 13px;
  color: #4a4a4a;
  line-height: 1.4;
`;
