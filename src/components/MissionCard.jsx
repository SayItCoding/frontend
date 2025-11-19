// src/components/MissionCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

/**
 * props:
 * - title: 미션 제목
 * - desc: 미션 한 줄 설명
 * - image: 썸네일 이미지 경로 (예: "/images/mission1.png")
 * - to: 이동할 링크 (예: "/mission?missionId=1")
 */
export default function MissionCard({ title, desc, image, to }) {
  return (
    <Card>
      {image && (
        <ThumbWrapper>
          <Thumb src={image} alt={title} />
        </ThumbWrapper>
      )}

      <CardBody>
        <CardTitle>{title}</CardTitle>
        <CardDesc>{desc}</CardDesc>
        <CardButton to={to}>미션 시작하기</CardButton>
      </CardBody>
    </Card>
  );
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
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

const CardButton = styled(Link)`
  display: inline-block;
  margin-top: 4px;
  padding: 8px 14px;
  border-radius: 999px;
  font-size: 13px;
  background: #4b7bec1a;
  color: #1d4ed8;
  text-decoration: none;
`;
