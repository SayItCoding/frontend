import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";

export default function AttendanceSectionCard({
  studySummary,
  loading,
  weekOffset,
  onChangeWeek,
}) {
  const [slideDirection, setSlideDirection] = useState(null); // 'left' | 'right' | null

  // 서버에서 온 원본 데이터 (날짜/초 단위 기록)
  const weeklyDays = studySummary?.weekly?.days ?? [];

  // date -> studySeconds 맵
  const dateSecondsMap = new Map(
    weeklyDays.map((d) => [d.date, d.studySeconds ?? 0])
  );

  // 화면에 그릴 "월~일 + 날짜" 배열을 startDate 기준으로 직접 생성
  const weekdayLabels = ["월", "화", "수", "목", "금", "토", "일"];
  let displayWeek = [];

  if (studySummary?.weekly?.startDate) {
    const start = new Date(studySummary.weekly.startDate);

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i); // startDate + i일

      const iso = d.toISOString().slice(0, 10); // 'YYYY-MM-DD'
      const seconds = dateSecondsMap.get(iso) ?? 0;

      displayWeek.push({
        label: weekdayLabels[i], // 무조건 월~일 순서
        date: iso,
        studySeconds: seconds,
      });
    }
  } else {
    // 데이터 없을 때 기본 placeholder
    displayWeek = weekdayLabels.map((label) => ({
      label,
      date: "",
      studySeconds: 0,
    }));
  }

  // "해당 주" 기준, 마지막 날짜부터 연속으로 학습한 일수
  const continuousStudyDays = (() => {
    if (!displayWeek.length) return 0;
    let streak = 0;
    for (let i = displayWeek.length - 1; i >= 0; i--) {
      const seconds = displayWeek[i]?.studySeconds ?? 0;
      if (seconds > 0) streak++;
      else break;
    }
    return streak;
  })();

  // 출석 배지 텍스트
  const attendanceBadgeText = loading
    ? "불러오는 중..."
    : continuousStudyDays > 0
    ? `연속 ${continuousStudyDays}일 학습 중`
    : "최근 7일 학습 기록 없음";

  // 주간 범위 텍스트 (YYYY.MM.DD ~ YYYY.MM.DD)
  const weekRangeText = studySummary
    ? `${studySummary.weekly.startDate
        .split("-")
        .join(".")} ~ ${studySummary.weekly.endDate.split("-").join(".")}`
    : "최근 7일";

  // 이전/다음 주 버튼 핸들러
  const handlePrevWeek = () => {
    setSlideDirection("left");
    onChangeWeek(weekOffset - 1);
  };

  const handleNextWeek = () => {
    if (weekOffset === 0) return; // 미래 주로는 못 가게 막기
    setSlideDirection("right");
    onChangeWeek(Math.min(0, weekOffset + 1));
  };

  return (
    <AttendanceCard>
      <SectionTitle>출석 현황</SectionTitle>

      <WeekRow>
        <WeekLeft>
          <WeekRangeText>{weekRangeText}</WeekRangeText>
          <WeekNavButtons>
            <WeekNavButton type="button" onClick={handlePrevWeek}>
              ‹ 이전 주
            </WeekNavButton>
            <WeekNavButton
              type="button"
              onClick={handleNextWeek}
              disabled={weekOffset === 0}
            >
              다음 주 ›
            </WeekNavButton>
          </WeekNavButtons>
        </WeekLeft>

        <Badge>{attendanceBadgeText}</Badge>
      </WeekRow>

      {/* 슬라이드 애니메이션 래퍼 */}
      <AttendanceContent
        key={studySummary?.weekly?.startDate ?? "attendance"}
        $direction={slideDirection}
      >
        <WeekDays>
          {displayWeek.map((d) => {
            const active = (d.studySeconds ?? 0) > 0;
            return (
              <Day key={d.label + d.date}>
                <div>{d.label}</div>
                <DayCircle $active={active}>
                  {d.date ? Number(d.date.slice(8, 10)) : "-"}
                </DayCircle>
              </Day>
            );
          })}
        </WeekDays>
      </AttendanceContent>
    </AttendanceCard>
  );
}

const slideFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const slideFromRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const CardBase = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
`;

const AttendanceCard = styled(CardBase)`
  flex: 1;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #232339;
`;

const WeekRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const WeekLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const WeekRangeText = styled.div`
  font-size: 13px;
  color: #8588a0;
`;

const WeekNavButtons = styled.div`
  display: flex;
  gap: 6px;
`;

const WeekNavButton = styled.button`
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid #e0e2f5;
  background: #f7f8ff;
  font-size: 11px;
  color: #6b6faa;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #edf0ff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

const Badge = styled.div`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  background: #f3e8ff;
  color: #7b4ef2;
`;

const AttendanceContent = styled.div`
  margin-top: 16px;
  animation: ${({ $direction }) =>
    $direction === "left"
      ? css`
          ${slideFromLeft} 0.25s ease
        `
      : $direction === "right"
      ? css`
          ${slideFromRight} 0.25s ease
        `
      : "none"};
`;

const WeekDays = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Day = styled.div`
  text-align: center;
  font-size: 12px;
  color: #9ea2b3;
`;

const DayCircle = styled.div`
  margin-top: 4px;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  background: ${({ $active }) => ($active ? "#6273ff" : "#f1f3ff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#7f85a5")};
`;
