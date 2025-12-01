import React from "react";
import styled from "styled-components";

export default function BadgeSectionCard({ badges }) {
  const unlocked = badges?.unlocked ?? [];
  const inProgress = badges?.inProgress ?? [];

  return (
    <SectionCard>
      <BadgeHeaderRow>
        <BadgeTitle>나의 뱃지</BadgeTitle>
        <BadgeSub>학습 기록이 쌓일수록 더 많은 뱃지를 모을 수 있어요.</BadgeSub>
      </BadgeHeaderRow>

      {/* 획득한 뱃지 */}
      <BadgeGroup>
        <BadgeGroupHeader>
          <BadgeGroupTitle>획득한 뱃지</BadgeGroupTitle>
          <BadgeGroupCount>{unlocked.length}개 획득</BadgeGroupCount>
        </BadgeGroupHeader>

        {unlocked.length === 0 ? (
          <BadgeEmptyText>
            아직 획득한 뱃지가 없어요. 첫 미션을 완료해볼까요?
          </BadgeEmptyText>
        ) : (
          <BadgeChipRow>
            {unlocked.map((b) => (
              <BadgeChip key={b.key ?? b.id}>
                <BadgeIcon>{b.icon}</BadgeIcon>
                <BadgeChipText>
                  <BadgeChipName>{b.name}</BadgeChipName>
                  <BadgeChipDesc>{b.description}</BadgeChipDesc>
                </BadgeChipText>
              </BadgeChip>
            ))}
          </BadgeChipRow>
        )}
      </BadgeGroup>

      {/* 도전 중인 뱃지 */}
      <BadgeGroup>
        <BadgeGroupHeader>
          <BadgeGroupTitle>도전 중인 뱃지</BadgeGroupTitle>
        </BadgeGroupHeader>

        {inProgress.length === 0 ? (
          <BadgeEmptyText>현재 진행 중인 뱃지가 없어요.</BadgeEmptyText>
        ) : (
          <BadgeProgressRow>
            {inProgress.map((b) => {
              const percent =
                b.progressTarget > 0
                  ? Math.min(
                      100,
                      Math.round((b.progressCurrent / b.progressTarget) * 100)
                    )
                  : 0;

              return (
                <BadgeProgressCard key={b.key ?? b.id}>
                  <BadgeProgressHeader>
                    <BadgeIcon>{b.icon}</BadgeIcon>
                    <BadgeProgressTitle>{b.name}</BadgeProgressTitle>
                  </BadgeProgressHeader>
                  <BadgeProgressDesc>{b.description}</BadgeProgressDesc>
                  <BadgeProgressBarTrack>
                    <BadgeProgressBarFill style={{ width: `${percent}%` }} />
                  </BadgeProgressBarTrack>
                  <BadgeProgressNumbers>
                    <span>
                      {b.progressCurrent}/{b.progressTarget}
                    </span>
                    <span>{percent}%</span>
                  </BadgeProgressNumbers>
                </BadgeProgressCard>
              );
            })}
          </BadgeProgressRow>
        )}
      </BadgeGroup>
    </SectionCard>
  );
}

const SectionCard = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
  margin-bottom: 28px;
`;

const BadgeHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BadgeTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #232339;
`;

const BadgeSub = styled.div`
  font-size: 12px;
  color: #8e92b0;
`;

const BadgeGroup = styled.div`
  & + & {
    margin-top: 18px;
    border-top: 1px solid #f1f2ff;
    padding-top: 16px;
  }
`;

const BadgeGroupHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
`;

const BadgeGroupTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2f3153;
`;

const BadgeGroupCount = styled.div`
  font-size: 11px;
  color: #a0a3c0;
`;

const BadgeEmptyText = styled.div`
  font-size: 12px;
  color: #a0a3c0;
`;

const BadgeChipRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d2d5f3;
    border-radius: 999px;
  }
`;

const BadgeChip = styled.div`
  flex: 0 0 auto;
  min-width: 180px;
  max-width: 220px;
  padding: 10px 12px;
  border-radius: 16px;
  background: #f7f8ff;
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const BadgeIcon = styled.div`
  font-size: 22px;
`;

const BadgeChipText = styled.div`
  flex: 1;
  min-width: 0;
`;

const BadgeChipName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #2d3050;
  margin-bottom: 2px;
`;

const BadgeChipDesc = styled.div`
  font-size: 11px;
  color: #8f93b2;
  line-height: 1.4;
`;

const BadgeProgressRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
`;

const BadgeProgressCard = styled.div`
  padding: 10px 12px;
  border-radius: 16px;
  background: #fdf8f1;
`;

const BadgeProgressHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const BadgeProgressTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #3b2e1f;
`;

const BadgeProgressDesc = styled.div`
  font-size: 11px;
  color: #a27c4c;
  margin-bottom: 6px;
`;

const BadgeProgressBarTrack = styled.div`
  height: 6px;
  border-radius: 999px;
  background: #f0e0c8;
  overflow: hidden;
`;

const BadgeProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #ffb36b, #ff7b6b);
`;

const BadgeProgressNumbers = styled.div`
  margin-top: 4px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #8f795c;
`;
