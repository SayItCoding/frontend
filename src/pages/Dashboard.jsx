// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  fetchMissionSummary,
} from "../api/dashboard";
import { fetchMyProfile } from "../api/user";
import StudyInsightSection from "../components/StudyInsightSection";

export default function Dashboard() {
  const navigate = useNavigate();

  // 로그인 여부 (처음부터 localStorage 기준으로 동기 초기화 → 깜빡임 방지)
  const [isLoggedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("access_token");
    return !!token;
  });

  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [studySummary, setStudySummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState("");

  const [missionSummary, setMissionSummary] = useState(null);
  const [loadingMissionSummary, setLoadingMissionSummary] = useState(false);
  const [missionSummaryError, setMissionSummaryError] = useState("");

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
  }, [isLoggedIn]);

  // 출석 현황 및 학습 시간 정보
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
  }, [weekOffset, isLoggedIn]);

  // 미션 요약 (시도/성공/정답률)
  useEffect(() => {
    if (!isLoggedIn) return;

    async function loadMissionSummaryData() {
      try {
        setLoadingMissionSummary(true);
        setMissionSummaryError("");
        const data = await fetchMissionSummary();
        setMissionSummary(data);
      } catch (err) {
        console.error(err);
        setMissionSummaryError("미션 요약 정보를 불러오지 못했습니다.");
      } finally {
        setLoadingMissionSummary(false);
      }
    }

    loadMissionSummaryData();
  }, [isLoggedIn]);

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
  }, [weekOffset, insightMode, isLoggedIn]);

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
  }, [isLoggedIn]);

  const userName = userProfile?.name ?? "학생";

  // 학습 요약/정답률은 missionSummary 기준으로
  const solvedMissions = missionSummary?.solvedMissions ?? 0;
  const totalMissions = missionSummary?.totalMissions ?? 0;
  const accuracy = missionSummary?.accuracy ?? 0; // %
  const aiFixRate = missionSummary?.aiFixRate ?? 0; // %

  return (
    <PageWrapper>
      <Header />

      {/* 로그인 안 한 경우: 미니 대시보드 + CTA */}
      {!isLoggedIn && (
        <GuestContent>
          <GuestTop>
            <GuestTitle>나만의 학습 대시보드를 활용해 보세요</GuestTitle>
            <GuestSub>
              로그인하면 말해 코딩에서 풀었던 미션, 학습 기록, 학습 분석이
              한눈에 보여요
            </GuestSub>
          </GuestTop>

          <GuestCenterWrapper>
            <GuestPreview>
              <img src="/assets/images/dashboardPreview.png" alt="preview" />
            </GuestPreview>
          </GuestCenterWrapper>

          <GuestCTAWrapper>
            <GuestPrimaryButton onClick={() => navigate("/login")}>
              로그인하고 내 학습 대시보드 보기
            </GuestPrimaryButton>
          </GuestCTAWrapper>
        </GuestContent>
      )}

      {/* 로그인 한 경우: 실제 대시보드 */}
      {isLoggedIn && (
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
                studyStreak={userProfile?.studyStreak}
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
        </Content>
      )}

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
  flex: 1.5;
  min-width: 0;
  display: flex;
`;

const MiddleRowRight = styled.div`
  flex: 1.5;
  min-width: 0;
  display: flex;
`;

const GuestContent = styled.div`
  width: 100%;
  max-width: 960px;
  margin: 40px auto 72px;
  padding: 32px 20px 40px;
`;

const GuestTop = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const GuestTitle = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #1f2933;
  margin-bottom: 10px;
`;

const GuestSub = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
`;

const GuestCenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
`;

const GuestPreview = styled.div`
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);

  width: 100%;

  max-width: 650px;
  margin: 0 auto; /* 중앙 정렬 */
  display: block;
  img {
    display: block;
    width: 100%;
    height: auto; /* 이미지 비율 유지 */
    border-radius: 16px;
  }
`;

const GuestCTAWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const GuestPrimaryButton = styled.button`
  padding: 12px 20px;
  border-radius: 999px;
  border: none;
  background: #4f80ff;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #4068d6;
  }
`;
