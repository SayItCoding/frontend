// src/components/MissionCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

/**
 * props:
 * - title: 미션 제목
 * - desc: 미션 한 줄 설명
 * - image: 썸네일 이미지
 * - difficulty: 난이도 (number, 예: 1, 2, 3)
 * - to: 이동 링크
 */
export default function MissionCard({
  title,
  desc,
  image,
  difficulty = 1,
  to,
  loading = false,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card $loading>
        <ThumbWrapper>
          <SkeletonBlock />
        </ThumbWrapper>

        <CardBody>
          <SkeletonLine style={{ width: "70%", marginBottom: 8 }} />
          <SkeletonLine style={{ width: "100%", marginBottom: 4 }} />
          <SkeletonLine style={{ width: "80%", marginBottom: 12 }} />
          <SkeletonPill style={{ width: 110 }} />
        </CardBody>
      </Card>
    );
  }

  const handleClick = () => {
    if (!to) return;
    navigate(to);
  };

  // number 로 들어온 난이도 정규화
  const level = typeof difficulty === "number" ? difficulty : 1;

  return (
    <Card onClick={handleClick} $clickable={!loading && !!to}>
      {image && (
        <ThumbWrapper>
          <Thumb src={image} alt={title} />
        </ThumbWrapper>
      )}

      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardDesc>{desc}</CardDesc>

        <BottomRow>
          <DifficultyBadge $level={level}>난이도 {level}</DifficultyBadge>
          <CardButton type="button">미션 시작하기</CardButton>
        </BottomRow>
      </CardBody>
    </Card>
  );
}

const skeletonStyle = css`
  background: #e5e7eb;
`;

const SkeletonBlock = styled.div`
  width: 100%;
  height: 100%;
  ${skeletonStyle}
`;

const SkeletonLine = styled.div`
  height: 14px;
  border-radius: 999px;
  ${skeletonStyle}
`;

const SkeletonPill = styled.div`
  height: 28px;
  border-radius: 999px;
  ${skeletonStyle}
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;

  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  pointer-events: ${({ $loading }) => ($loading ? "none" : "auto")};
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  ${({ $clickable }) =>
    $clickable &&
    css`
      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.16);
      }

      &:active {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(15, 23, 42, 0.14);
      }
    `}
`;

const ThumbWrapper = styled.div`
  width: 100%;
  height: 120px;
  background: #e5edff;
  overflow: hidden;
`;

const Thumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 16px 18px;
`;

const CardTitle = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 15px;
  color: #111827;
`;

const CardDesc = styled.p`
  font-size: 13px;
  color: #6b7280;
  min-height: 40px;
  margin: 0 0 10px 0;
`;

/* 난이도 + 버튼 Row */
const BottomRow = styled.div`
  margin-top: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/* ⭐ 난이도 숫자에 따라 색상 변경 */
const DifficultyBadge = styled.div`
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 999px;

  ${({ $level }) => {
    if ($level <= 1) {
      // 초급
      return css`
        background: #ecfdf3;
        color: #166534;
      `;
    }
    if ($level === 2) {
      // 중급
      return css`
        background: #fffbeb;
        color: #92400e;
      `;
    }
    // 3 이상 고급
    return css`
      background: #fef2f2;
      color: #b91c1c;
    `;
  }}
`;

const CardButton = styled.button`
  display: inline-block;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  background: #4b7bec1a;
  color: #1d4ed8;
  border: none;
  outline: none;
  cursor: inherit; /* 카드와 동일한 커서 */
`;
