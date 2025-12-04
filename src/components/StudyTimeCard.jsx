// src/components/StudyTimeCard.jsx
import React from "react";
import styled from "styled-components";
import { formatDate, formatSecondsToKoreanTime } from "../utils/timeFormat";

export default function StudyTimeCard({ studySummary, loading, error }) {
  // 로딩 중: 스켈레톤 UI
  if (loading) {
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    return (
      <TimeCard>
        <TimeHeaderRow>
          <TimeHeaderLeft>
            <SectionTitle>학습 시간</SectionTitle>
            <SkeletonBlock width="140px" height="12px" />
            <SkeletonBlock
              width="90px"
              height="14px"
              style={{ marginTop: 4 }}
            />
          </TimeHeaderLeft>

          <TotalTimeBox>
            <SkeletonCircle size="32px" />
            <TotalTimeTextBox>
              <SkeletonBlock width="80px" height="11px" />
              <SkeletonBlock
                width="70px"
                height="20px"
                style={{ marginTop: 4 }}
              />
            </TotalTimeTextBox>
          </TotalTimeBox>
        </TimeHeaderRow>

        <WeeklyTimeWrapper>
          <WeeklyBarRow>
            {days.map((d, idx) => (
              <WeeklyBarItem key={d}>
                <SkeletonBar style={{ height: `${40 + (idx % 3) * 10}px` }} />
                <WeeklyBarDay>{d}</WeeklyBarDay>
              </WeeklyBarItem>
            ))}
          </WeeklyBarRow>
        </WeeklyTimeWrapper>
      </TimeCard>
    );
  }

  // 로딩이 아닐 때: 실제 데이터/에러 처리

  // 총 학습 시간 텍스트
  const totalStudyTimeText = studySummary
    ? formatSecondsToKoreanTime(studySummary.totalStudySeconds)
    : "0분";

  // 주간 데이터 (요일별)
  const weeklyDays = studySummary?.weekly?.days ?? [];

  const weeklyStudyTime = ["월", "화", "수", "목", "금", "토", "일"].map(
    (label) => {
      const dayData = weeklyDays.find((d) => d.label === label);
      const seconds = dayData?.studySeconds ?? 0;
      const minutes = Math.round(seconds / 60);
      return { day: label, minutes };
    }
  );

  const maxWeeklyMinutes = Math.max(
    ...weeklyStudyTime.map((d) => d.minutes || 0),
    1
  );

  // 날짜 범위 라벨 (2025.11.25 ~ 2025.12.01 학습 시간)
  const periodLabel = studySummary?.weekly
    ? `${formatDate(studySummary.weekly.startDate)} ~ ${formatDate(
        studySummary.weekly.endDate
      )}`
    : "이번 주 학습 시간";

  // 이번 주(해당 주차) 전체 학습 시간 (초)
  const weeklyTotalSeconds = weeklyDays.reduce(
    (sum, d) => sum + (d.studySeconds ?? 0),
    0
  );
  const weeklyTotalText = formatSecondsToKoreanTime(weeklyTotalSeconds);

  return (
    <TimeCard>
      {/* 상단: 제목 + 기간 + 총 학습 시간 */}
      <TimeHeaderRow>
        <TimeHeaderLeft>
          <SectionTitle>학습 시간</SectionTitle>
          <PeriodText>{periodLabel}</PeriodText>
          <WeeklySumText>{weeklyTotalText}</WeeklySumText>
        </TimeHeaderLeft>

        <TotalTimeBox>
          <TotalTimeTextBox>
            <TotalTimeLabel>⏳ 총 학습 시간</TotalTimeLabel>
            <TotalTimeValue>{totalStudyTimeText}</TotalTimeValue>
          </TotalTimeTextBox>
        </TotalTimeBox>
      </TimeHeaderRow>

      {/* 하단: 그래프 (카드 바닥에 붙도록 margin-top: auto) */}
      <WeeklyTimeWrapper>
        <WeeklyBarRow>
          {weeklyStudyTime.map((d) => (
            <WeeklyBarItem key={d.day}>
              <WeeklyBar
                style={{
                  height: `${(d.minutes / maxWeeklyMinutes) * 80 || 4}px`,
                }}
                $active={d.minutes > 0}
              />
              <WeeklyBarDay>{d.day}</WeeklyBarDay>
            </WeeklyBarItem>
          ))}
        </WeeklyBarRow>

        {error && <ErrorText>⚠ {error}</ErrorText>}
      </WeeklyTimeWrapper>
    </TimeCard>
  );
}

const CardBase = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
`;

const TimeCard = styled(CardBase)`
  display: flex;
  flex-direction: column;
  min-height: 180px;
  width: 100%;
  flex: 1;
`;

const TimeHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const TimeHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: #232339;
`;

const PeriodText = styled.div`
  font-size: 12px;
  color: #9ea2b3;
`;

const WeeklySumText = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #4f5cff;
  font-weight: 600;
`;

const TotalTimeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Hourglass = styled.div`
  font-size: 24px;
  opacity: 0.8;
`;

const TotalTimeTextBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TotalTimeLabel = styled.div`
  font-size: 11px;
  color: #9ea2b3;
`;

const TotalTimeValue = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #4f5cff;
`;

const WeeklyTimeWrapper = styled.div`
  margin-top: auto;
  padding-top: 16px;
`;

const WeeklyBarRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 90px;
`;

const WeeklyBarItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WeeklyBar = styled.div`
  width: 10px;
  border-radius: 12px 12px 4px 4px;
  background: ${({ $active }) => ($active ? "#6273ff" : "#e3e6ff")};
  transition: height 0.2s ease;
`;

const WeeklyBarDay = styled.div`
  margin-top: 4px;
  font-size: 11px;
  color: #a0a3c0;
`;

const ErrorText = styled.div`
  margin-top: 8px;
  font-size: 11px;
  color: #e15757;
`;

const skeletonColor = "#eceff3";

const SkeletonBlock = styled.div`
  border-radius: 999px;
  height: ${({ height }) => height || "14px"};
  width: ${({ width }) => width || "100%"};
  background: ${skeletonColor};
`;

const SkeletonCircle = styled.div`
  width: ${({ size }) => size || "32px"};
  height: ${({ size }) => size || "32px"};
  border-radius: 50%;
  background: ${skeletonColor};
`;

const SkeletonBar = styled.div`
  width: 10px;
  border-radius: 12px 12px 4px 4px;
  background: ${skeletonColor};
`;
