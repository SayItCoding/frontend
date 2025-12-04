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
          <RecentStudyCard
            recentMissions={recentMissions}
            loading={loadingRecent}
            error={recentError}
          />
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

        {/*<BadgeSectionCard badges={badges} />*/}
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
  flex: 1.9;
  min-width: 0;
  display: flex;
`;

const MiddleRowRight = styled.div`
  flex: 1.1;
  min-width: 0;
  display: flex;
`;
