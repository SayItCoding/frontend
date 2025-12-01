// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileCard from "../components/ProfileCard";
import AttendanceSectionCard from "../components/AttendanceSectionCard";
import StudyTimeCard from "../components/StudyTimeCard";
import StudySummaryCard from "../components/StudySummaryCard";
import RecentStudyCard from "../components/RecentStudyCard";
import BadgeSectionCard from "../components/BadgeSectionCard";
import SkillAnalysisCard from "../components/SkillAnalysisCard";
import { fetchStudySummary } from "../api/studySession";

export default function Dashboard() {
  const [studySummary, setStudySummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  // 0: 이번 주, -1: 지난주, -2: 지지난주 ...
  const [weekOffset, setWeekOffset] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setLoadingSummary(true);
        setSummaryError("");

        // GET /api/v1/study-sessions/summary?weekOffset=0
        const data = await fetchStudySummary(weekOffset);
        setStudySummary(data);
      } catch (err) {
        console.error("❌ 학습 요약 불러오기 실패:", err);
        setSummaryError("학습 정보를 불러오지 못했어요.");
      } finally {
        setLoadingSummary(false);
      }
    }
    load();
  }, [weekOffset]);

  // TODO: 나중에 API 연동해서 실제 값으로 교체
  const userName = "홍길동";

  const solvedMissions = 8;
  const totalMissions = 12;
  const accuracy = 76; // 정답률
  const aiFixRate = 82; // AI 피드백 받고 수정 성공한 비율

  // 컴퓨팅 사고 역량 (임시 점수)
  const skillScores = [
    { key: "procedure", label: "절차적 사고 / 순서 설계", value: 78 },
    { key: "loop", label: "반복 구조 활용", value: 72 },
    { key: "condition", label: "조건분기 활용", value: 65 },
    { key: "clarity", label: "표현 명확성 (자연어 → 코드)", value: 81 },
    { key: "concept", label: "개념 이해도 (반복·조건)", value: 70 },
  ];

  // 최근 학습 기록 (임시)
  const recentMissions = [
    {
      id: 1,
      title: "반복문 미션 1: 엔트리봇 앞으로 걷기",
      date: "11.28",
      status: "성공",
      skillTag: "반복문",
    },
    {
      id: 2,
      title: "조건문 미션 1: 동전이 있으면 점프",
      date: "11.27",
      status: "재도전",
      skillTag: "조건문",
    },
    {
      id: 3,
      title: "경로 설계 미션: 친구 만나러 가기",
      date: "11.26",
      status: "성공",
      skillTag: "경로 설계",
    },
  ];

  // 뱃지 mock 데이터 (대시보드 API 붙일 때 badges.unlocked / badges.inProgress로 교체 예정)
  const badges = {
    unlocked: [
      {
        id: 1,
        key: "first_mission_cleared",
        name: "첫 미션 성공!",
        description: "말해 코딩에서 첫 번째 미션을 성공했어요.",
        icon: "⭐",
        earnedAt: "2025-11-25T10:00:00.000Z",
      },
      {
        id: 2,
        key: "streak_3_days",
        name: "연속 3일 학습",
        description: "3일 연속으로 말해 코딩에 참여했어요.",
        icon: "🔥",
        earnedAt: "2025-11-28T11:20:00.000Z",
      },
      {
        id: 3,
        key: "ai_fix_1",
        name: "AI와 첫 교정",
        description: "AI 피드백을 반영해서 코드를 고쳐봤어요.",
        icon: "🤖",
        earnedAt: "2025-11-27T09:00:00.000Z",
      },
    ],
    inProgress: [
      {
        id: 4,
        key: "streak_7_days",
        name: "연속 7일 챌린지",
        description: "7일 동안 하루도 빠지지 않고 학습해 보세요.",
        icon: "🏁",
        progressCurrent: 3,
        progressTarget: 7,
      },
      {
        id: 5,
        key: "loop_master_10",
        name: "반복문 마스터",
        description: "반복문 미션을 10개 성공하면 획득할 수 있어요.",
        icon: "🔁",
        progressCurrent: 4,
        progressTarget: 10,
      },
    ],
  };

  return (
    <PageWrapper>
      <Header />
      <Content>
        <TopRow>
          <TopRowLeft>
            <ProfileCard
              userName={userName}
              solvedMissions={solvedMissions}
              totalMissions={totalMissions}
              accuracy={accuracy}
              aiFixRate={aiFixRate}
            />
          </TopRowLeft>

          <TopRowRight>
            <AttendanceSectionCard
              studySummary={studySummary}
              loading={loadingSummary}
              weekOffset={weekOffset}
              onChangeWeek={setWeekOffset}
            />
          </TopRowRight>
        </TopRow>

        <MiddleRow>
          <MiddleRowLeft>
            <StudySummaryCard
              solvedMissions={solvedMissions}
              totalMissions={totalMissions}
              accuracy={accuracy}
              aiFixRate={aiFixRate}
            />
          </MiddleRowLeft>

          <MiddleRowRight>
            <StudyTimeCard studySummary={studySummary} error={summaryError} />
          </MiddleRowRight>
        </MiddleRow>

        <BottomSection>
          <BottomGrid>
            <RecentStudyCard recentMissions={recentMissions} />

            <SkillAnalysisCard skillScores={skillScores} />
          </BottomGrid>
        </BottomSection>

        <BadgeSectionCard badges={badges} />
      </Content>
      <Footer />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f6fb;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 32px 16px 80px;
  flex: 1;
`;

const TopRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 28px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const TopRowLeft = styled.div`
  flex: 1.5;
  min-width: 0;
  display: flex;
`;

const TopRowRight = styled.div`
  flex: 1.5;
  min-width: 0;
  display: flex;
`;

const MiddleRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 28px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const MiddleRowLeft = styled.div`
  flex: 2;
  min-width: 0;
  display: flex;
`;

const MiddleRowRight = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
`;

const BottomSection = styled.div`
  margin-bottom: 40px;
`;

const BottomGrid = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 1.4fr 1.6fr;
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
