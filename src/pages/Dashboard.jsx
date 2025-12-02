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
import {
  fetchStudySummary,
  fetchStudyInsights,
  fetchRecentMissions,
} from "../api/dashboard";
import { fetchMyProfile } from "../api/user";
import StudyInsightSection from "../components/StudyInsightSection";

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [studySummary, setStudySummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const [studyInsight, setStudyInsight] = useState(null);
  const [insightMode, setInsightMode] = useState("overall"); // 'week' | 'overall'
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState("");

  const [recentMissions, setRecentMissions] = useState([]);
  const [recentError, setRecentError] = useState("");
  const [loadingRecent, setLoadingRecent] = useState(false);
  const RECENT_LIMIT = 6;

  // 0: 이번 주, -1: 지난주, -2: 지지난주 ...
  const [weekOffset, setWeekOffset] = useState(0);

  // 내 정보
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoadingProfile(true);
        setProfileError("");
        const data = await fetchMyProfile();
        setUserProfile(data);
      } catch (err) {
        console.error(err);
        setProfileError("내 정보를 불러오지 못했습니다.");
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  // 학습 요약 정보
  useEffect(() => {
    async function load() {
      try {
        setLoadingSummary(true);
        setSummaryError("");
        const data = await fetchStudySummary(weekOffset);
        setStudySummary(data);
      } catch (err) {
        console.error(err);
        setSummaryError("학습 요약 정보를 불러오지 못했습니다.");
      } finally {
        setLoadingSummary(false);
      }
    }
    load();
  }, [weekOffset]);

  // 학습 분석
  useEffect(() => {
    async function loadInsight() {
      try {
        setLoadingInsight(true);
        setInsightError("");

        const data = await fetchStudyInsights({
          mode: insightMode,
          weekOffset,
        });
        setStudyInsight(data);
      } catch (err) {
        console.error(err);
        setInsightError("학습 인사이트 정보를 불러오지 못했습니다.");
      } finally {
        setLoadingInsight(false);
      }
    }
    loadInsight();
  }, [weekOffset, insightMode]);

  // 최근 학습 미션
  useEffect(() => {
    async function loadRecent() {
      try {
        setLoadingRecent(true);
        setRecentError("");

        const { items } = await fetchRecentMissions(RECENT_LIMIT);

        const formatted = (items ?? []).map((item) => {
          const d = new Date(item.date);
          const dateStr = d.toLocaleDateString("ko-KR", {
            month: "2-digit",
            day: "2-digit",
          });

          return {
            id: item.missionId,
            title: item.title,
            date: dateStr,
            status: item.status,
            category: item.category,
          };
        });

        setRecentMissions(formatted);
      } catch (err) {
        console.error(err);
        setRecentError("최근 학습 기록을 불러오지 못했습니다.");
      } finally {
        setLoadingRecent(false);
      }
    }

    loadRecent();
  }, []);

  const userName = userProfile?.name ?? "학생";

  // 학습 요약에서 값 끌어오기 (studySummary 구조에 맞게 필드명 조정)
  const solvedMissions = studySummary?.totalSolvedMissions ?? 0;
  const totalMissions = studySummary?.totalMissions ?? 0;
  const accuracy = studySummary?.accuracyRate ?? 0; // %
  const aiFixRate = studySummary?.aiFixSuccessRate ?? 0; // %

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
              loading={loadingProfile}
              error={profileError}
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

        <MiddleRow>
          <StudyInsightSection
            summary={studyInsight}
            loading={loadingInsight}
            error={insightError}
            mode={insightMode}
            onChangeMode={setInsightMode}
          />
        </MiddleRow>

        <MiddleRow>
          <RecentStudyCard
            recentMissions={recentMissions}
            loading={loadingRecent}
            error={recentError}
          />
        </MiddleRow>

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
