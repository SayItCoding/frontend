// src/components/StudySummaryCard.jsx
import React from "react";
import styled from "styled-components";

export default function StudySummaryCard({
  solvedMissions,
  totalMissions,
  accuracy,
  aiFixRate,
  loading,
}) {
  const solvedRatio =
    totalMissions > 0 ? (solvedMissions / totalMissions) * 100 : 0;

  // 로딩 중: 스켈레톤 UI
  if (loading) {
    return (
      <SectionCard>
        <RowHeader>
          <SectionTitle>학습 요약</SectionTitle>
        </RowHeader>

        <StudyInfoGrid>
          {/* 미션 진행도 스켈레톤 */}
          <InfoBlock>
            <SkeletonBlock width="80px" height="13px" />
            <SkeletonBlock
              width="120px"
              height="22px"
              style={{ marginTop: 10 }}
            />
            <SkeletonProgressBar>
              <SkeletonProgressFill />
            </SkeletonProgressBar>
            <SkeletonBlock
              width="100%"
              height="12px"
              style={{ marginTop: 8 }}
            />
          </InfoBlock>

          {/* 정답률 스켈레톤 */}
          <InfoBlockCenter>
            <SkeletonBlock
              width="60px"
              height="13px"
              style={{ margin: "0 auto 8px" }}
            />
            <CircleWrapper>
              <SkeletonRing />
            </CircleWrapper>
            <SkeletonBlock
              width="80%"
              height="11px"
              style={{ margin: "6px auto 0" }}
            />
          </InfoBlockCenter>

          {/* AI 피드백 해결률 스켈레톤 */}
          <InfoBlockCenter>
            <SkeletonBlock
              width="100px"
              height="13px"
              style={{ margin: "0 auto 8px" }}
            />
            <CircleWrapper>
              <SkeletonRing />
            </CircleWrapper>
            <SkeletonBlock
              width="90%"
              height="11px"
              style={{ margin: "6px auto 0" }}
            />
          </InfoBlockCenter>
        </StudyInfoGrid>
      </SectionCard>
    );
  }

  // 실제 데이터 UI
  return (
    <SectionCard>
      <RowHeader>
        <SectionTitle>학습 요약</SectionTitle>
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

        {/* AI 피드백 해결률 
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
        </InfoBlockCenter>*/}
      </StudyInfoGrid>
    </SectionCard>
  );
}

const SectionCard = styled.div`
  flex: 1;
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
  grid-template-columns: 1.2fr 1.8fr;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const skeletonColor = "#eceff3";

const SkeletonBlock = styled.div`
  border-radius: 999px;
  height: ${({ height }) => height || "14px"};
  width: ${({ width }) => width || "100%"};
  background: ${skeletonColor};
`;

const SkeletonProgressBar = styled.div`
  margin-top: 6px;
  height: 6px;
  border-radius: 999px;
  background: #edf0ff;
  overflow: hidden;
`;

const SkeletonProgressFill = styled.div`
  width: 60%;
  height: 100%;
  border-radius: inherit;
  background: ${skeletonColor};
`;

const SkeletonRing = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${skeletonColor};
`;
