import React from "react";
import styled from "styled-components";

export default function SkillAnalysisCard({ skillScores }) {
  return (
    <Card>
      <HeaderRow>
        <Title>컴퓨팅 사고 역량</Title>
        <SubTitle>
          말해 코딩에서 수집된 자연어·코드 데이터를 기반으로 분석해요.
        </SubTitle>
      </HeaderRow>

      <SkillList>
        {skillScores.map((s) => (
          <SkillRow key={s.key}>
            <SkillLabel>{s.label}</SkillLabel>
            <SkillValue>{s.value}%</SkillValue>
            <SkillBarTrack>
              <SkillBarFill style={{ width: `${s.value}%` }} />
            </SkillBarTrack>
          </SkillRow>
        ))}
      </SkillList>
    </Card>
  );
}

const Card = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeaderRow = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  color: #8e92b0;
`;

const SkillList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkillRow = styled.div`
  display: grid;
  grid-template-columns: 1.6fr 60px 3fr;
  align-items: center;
  gap: 8px;
`;

const SkillLabel = styled.div`
  font-size: 13px;
  color: #4b4f6e;
`;

const SkillValue = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #4f5cff;
  text-align: right;
`;

const SkillBarTrack = styled.div`
  height: 6px;
  border-radius: 999px;
  background: #edf0ff;
  overflow: hidden;
`;

const SkillBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ffb36b, #ff7b6b);
`;
