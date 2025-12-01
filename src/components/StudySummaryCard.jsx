import React from "react";
import styled from "styled-components";

export default function StudySummaryCard({
  solvedMissions,
  totalMissions,
  accuracy,
  aiFixRate,
}) {
  const solvedRatio =
    totalMissions > 0 ? (solvedMissions / totalMissions) * 100 : 0;

  return (
    <SectionCard>
      <RowHeader>
        <SectionTitle>학습 요약</SectionTitle>
        <RowSubTitle>자연어 → 코드 학습 진행 상황</RowSubTitle>
      </RowHeader>

      <StudyInfoGrid>
        {/* 미션 진행도 */}
        <InfoBlock>
          <InfoLabel>미션 진행도</InfoLabel>
          <ProblemCount>
            <strong>{solvedMissions}</strong>/{totalMissions}개 완료
          </ProblemCount>
          <ProgressBar>
            <ProgressFill style={{ width: `${solvedRatio}%` }} />
          </ProgressBar>
          <InfoDesc>
            말로 설명한 절차가 실제 코드로 얼마나 잘 완성됐는지 보여줘요.
          </InfoDesc>
        </InfoBlock>

        {/* 정답률 */}
        <InfoBlockCenter>
          <InfoLabel>정답률</InfoLabel>
          <CircleWrapper>
            <Ring value={accuracy}>
              <RingInner>
                <RingValue>{accuracy}%</RingValue>
              </RingInner>
            </Ring>
          </CircleWrapper>
          <InfoDescSmall>미션의 목표를 정확히 달성한 비율이에요.</InfoDescSmall>
        </InfoBlockCenter>

        {/* AI 피드백 해결률 */}
        <InfoBlockCenter>
          <InfoLabel>AI 피드백 해결률</InfoLabel>
          <CircleWrapper>
            <Ring value={aiFixRate}>
              <RingInner>
                <RingValue>{aiFixRate}%</RingValue>
              </RingInner>
            </Ring>
          </CircleWrapper>
          <InfoDescSmall>
            AI가 알려준 절차적 오류/개선점을 반영한 비율이에요.
          </InfoDescSmall>
        </InfoBlockCenter>
      </StudyInfoGrid>
    </SectionCard>
  );
}

const SectionCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
`;

const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #232339;
`;

const RowSubTitle = styled.div`
  font-size: 12px;
  color: #9ea2b3;
`;

const StudyInfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr 1fr;
  gap: 24px;
  margin-top: 8px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoBlockCenter = styled.div`
  text-align: center;
`;

const InfoLabel = styled.div`
  font-size: 13px;
  color: #9ea2b3;
  margin-bottom: 8px;
`;

const ProblemCount = styled.div`
  font-size: 20px;
  margin-bottom: 10px;
  strong {
    font-size: 26px;
    font-weight: 700;
    color: #4f5cff;
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  border-radius: 999px;
  background: #edf0ff;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #6071ff, #9e6bff);
`;

const InfoDesc = styled.div`
  margin-top: 8px;
  font-size: 12px;
  color: #9397b2;
`;

const InfoDescSmall = styled.div`
  margin-top: 6px;
  font-size: 11px;
  color: #a0a3c0;
`;

const CircleWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Ring = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ value }) =>
    `conic-gradient(#6273ff 0% ${value}%, #e6e9ff ${value}% 100%)`};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RingInner = styled.div`
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RingValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #4f5cff;
`;
