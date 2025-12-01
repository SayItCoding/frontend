// src/pages/DashboardPage.jsx
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Dashboard() {
  // TODO: 나중에 API 연동해서 실제 값으로 교체
  const userName = "홍길동";

  const solvedMissions = 8;
  const totalMissions = 12;
  const accuracy = 76; // 정답률
  const aiFixRate = 82; // AI 피드백 받고 수정 성공한 비율
  const taskAchievement = 89;
  const totalStudyTime = "2시간 36분";
  const weeklyStudyTime = [
    { day: "월", minutes: 35 },
    { day: "화", minutes: 20 },
    { day: "수", minutes: 50 },
    { day: "목", minutes: 0 },
    { day: "금", minutes: 40 },
    { day: "토", minutes: 15 },
    { day: "일", minutes: 0 },
  ];

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

  const solvedRatio = (solvedMissions / totalMissions) * 100;

  const maxWeeklyMinutes = Math.max(
    ...weeklyStudyTime.map((d) => d.minutes || 0),
    1
  );

  return (
    <PageWrapper>
      <Header />
      <Content>
        {/* 상단: 프로필 + 출석 / 오늘의 상태 */}
        <TopRow>
          <ProfileCard>
            <SmallLabel>말해 코딩 · 대시보드</SmallLabel>
            <ProfileArea>
              <Avatar />
              <div>
                <Name>{userName}님</Name>
                <ProfileSub>
                  오늘도 한 문장씩 말하면서 코딩 실력을 키워볼까요?
                </ProfileSub>
              </div>
            </ProfileArea>
            <ProfileStatsRow>
              <ProfileStat>
                <ProfileStatLabel>완료한 미션</ProfileStatLabel>
                <ProfileStatValue>
                  {solvedMissions}/{totalMissions}
                </ProfileStatValue>
              </ProfileStat>
              <ProfileStat>
                <ProfileStatLabel>정답률</ProfileStatLabel>
                <ProfileStatValue>{accuracy}%</ProfileStatValue>
              </ProfileStat>
              <ProfileStat>
                <ProfileStatLabel>AI 피드백 해결률</ProfileStatLabel>
                <ProfileStatValue>{aiFixRate}%</ProfileStatValue>
              </ProfileStat>
            </ProfileStatsRow>
          </ProfileCard>

          <AttendanceCard>
            <SectionTitle>출석 & 이번 주 학습</SectionTitle>
            <WeekRow>
              <WeekInfo>11월 4주차</WeekInfo>
              <Badge>연속 3일 학습 중</Badge>
            </WeekRow>
            <WeekDays>
              {["월", "화", "수", "목", "금", "토", "일"].map((d, i) => (
                <Day key={d}>
                  <div>{d}</div>
                  <DayCircle $active={i < 3}>{i + 1}</DayCircle>
                </Day>
              ))}
            </WeekDays>
          </AttendanceCard>
        </TopRow>

        {/* 중단: 학습 요약 + 총 학습 시간 / 주간 그래프 */}
        <MiddleRow>
          <StudyInfoCard>
            <RowHeader>
              <SectionTitle>학습 요약</SectionTitle>
              <RowSubTitle>자연어 → 코드 학습 진행 상황</RowSubTitle>
            </RowHeader>

            <StudyInfoGrid>
              {/* 문제 풀이 / 미션 진행도 */}
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
                <InfoDescSmall>
                  미션의 목표를 정확히 달성한 비율이에요.
                </InfoDescSmall>
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
          </StudyInfoCard>

          <TotalTimeCard>
            <SectionTitle>학습 시간</SectionTitle>
            <TimeContent>
              <Hourglass>⏳</Hourglass>
              <div>
                <TimeLabel>총 학습 시간</TimeLabel>
                <TimeText>{totalStudyTime}</TimeText>
              </div>
            </TimeContent>

            <WeeklyTimeWrapper>
              <WeeklyTimeTitle>이번 주 학습 시간</WeeklyTimeTitle>
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
            </WeeklyTimeWrapper>
          </TotalTimeCard>
        </MiddleRow>

        {/* 뱃지 섹션 */}
        <BadgeSection>
          <BadgeHeaderRow>
            <BadgeTitle>나의 뱃지</BadgeTitle>
            <BadgeSub>
              학습 기록이 쌓일수록 더 많은 뱃지를 모을 수 있어요.
            </BadgeSub>
          </BadgeHeaderRow>

          {/* 획득한 뱃지 */}
          <BadgeGroup>
            <BadgeGroupHeader>
              <BadgeGroupTitle>획득한 뱃지</BadgeGroupTitle>
              <BadgeGroupCount>{badges.unlocked.length}개 획득</BadgeGroupCount>
            </BadgeGroupHeader>

            {badges.unlocked.length === 0 ? (
              <BadgeEmptyText>
                아직 획득한 뱃지가 없어요. 첫 미션을 완료해볼까요?
              </BadgeEmptyText>
            ) : (
              <BadgeChipRow>
                {badges.unlocked.map((b) => (
                  <BadgeChip key={b.key}>
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

            {badges.inProgress.length === 0 ? (
              <BadgeEmptyText>현재 진행 중인 뱃지가 없어요.</BadgeEmptyText>
            ) : (
              <BadgeProgressRow>
                {badges.inProgress.map((b) => {
                  const percent =
                    b.progressTarget > 0
                      ? Math.min(
                          100,
                          Math.round(
                            (b.progressCurrent / b.progressTarget) * 100
                          )
                        )
                      : 0;
                  return (
                    <BadgeProgressCard key={b.key}>
                      <BadgeProgressHeader>
                        <BadgeIcon>{b.icon}</BadgeIcon>
                        <BadgeProgressTitle>{b.name}</BadgeProgressTitle>
                      </BadgeProgressHeader>
                      <BadgeProgressDesc>{b.description}</BadgeProgressDesc>
                      <BadgeProgressBarTrack>
                        <BadgeProgressBarFill
                          style={{ width: `${percent}%` }}
                        />
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
        </BadgeSection>

        {/* 하단: 컴퓨팅 사고 역량 + 최근 학습 기록 */}
        <BottomSection>
          <BottomGrid>
            {/* 왼쪽: 역량 분석 */}
            <LargeCard>
              <LargeCardHeaderRow>
                <LargeCardTitle>컴퓨팅 사고 역량</LargeCardTitle>
                <LargeCardSubTitle>
                  말해 코딩에서 수집된 자연어·코드 데이터를 기반으로 분석해요.
                </LargeCardSubTitle>
              </LargeCardHeaderRow>

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
            </LargeCard>

            {/* 오른쪽: 최근 학습 기록 */}
            <LargeCard>
              <LargeCardHeaderRow>
                <LargeCardTitle>최근 학습 기록</LargeCardTitle>
                <LargeCardSubTitle>
                  어떤 미션에서 어떤 개념을 연습했는지 한눈에 볼 수 있어요.
                </LargeCardSubTitle>
              </LargeCardHeaderRow>

              <RecentList>
                {recentMissions.map((m) => (
                  <RecentItem key={m.id}>
                    <RecentLeft>
                      <RecentTitle>{m.title}</RecentTitle>
                      <RecentMeta>
                        <RecentDate>{m.date}</RecentDate>
                        <Tag>{m.skillTag}</Tag>
                      </RecentMeta>
                    </RecentLeft>
                    <RecentStatus $status={m.status}>{m.status}</RecentStatus>
                  </RecentItem>
                ))}
              </RecentList>
            </LargeCard>
          </BottomGrid>
        </BottomSection>
      </Content>
      <Footer />
    </PageWrapper>
  );
}

/* ===== 공통 레이아웃 ===== */

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

const CardBase = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
`;

/* ===== 상단: 프로필 / 출석 ===== */

const ProfileCard = styled(CardBase)`
  flex: 1.4;
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const SmallLabel = styled.div`
  font-size: 11px;
  color: #9ea2b3;
  margin-bottom: 12px;
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #dfe3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  &::before {
    content: "👤";
    font-size: 28px;
  }
`;

const Name = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const ProfileSub = styled.div`
  font-size: 13px;
  color: #8b8fa8;
  margin-top: 4px;
`;

const ProfileStatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 18px;
  flex-wrap: wrap;
`;

const ProfileStat = styled.div`
  min-width: 120px;
`;

const ProfileStatLabel = styled.div`
  font-size: 12px;
  color: #9ea2b3;
  margin-bottom: 4px;
`;

const ProfileStatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #4f5cff;
`;

const WeekRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Badge = styled.div`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  background: #f3e8ff;
  color: #7b4ef2;
`;

const WeekInfo = styled.div`
  font-size: 13px;
  color: #8588a0;
`;

const WeekDays = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
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

/* ===== 중단: 학습 요약 / 학습 시간 ===== */

const MiddleRow = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const StudyInfoCard = styled(CardBase)`
  flex: 2;
`;

const TotalTimeCard = styled(CardBase)`
  flex: 1.3;
  position: relative;
  overflow: hidden;
`;

const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
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

const InfoBlock = styled.div``;

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

/* 원형 프로그레스 */

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

/* 학습 시간 */

const TimeContent = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Hourglass = styled.div`
  font-size: 28px;
  opacity: 0.7;
`;

const TimeLabel = styled.div`
  font-size: 12px;
  color: #9ea2b3;
  margin-bottom: 2px;
`;

const TimeText = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #4f5cff;
`;

const WeeklyTimeWrapper = styled.div`
  margin-top: 18px;
`;

const WeeklyTimeTitle = styled.div`
  font-size: 12px;
  color: #9ea2b3;
  margin-bottom: 8px;
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

/* ===== 뱃지 섹션 ===== */

const BadgeSection = styled(CardBase)`
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

/* ===== 하단 섹션 ===== */

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

const LargeCard = styled(CardBase)``;

const LargeCardHeaderRow = styled.div`
  margin-bottom: 16px;
`;

const LargeCardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
`;

const LargeCardSubTitle = styled.div`
  font-size: 12px;
  color: #8e92b0;
`;

/* 역량 분석 리스트 */

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

/* 최근 학습 기록 */

const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RecentItem = styled.div`
  padding: 12px 14px;
  border-radius: 16px;
  background: #f7f8ff;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RecentLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

const RecentTitle = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #2d3050;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RecentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RecentDate = styled.div`
  font-size: 11px;
  color: #a0a3c0;
`;

const Tag = styled.div`
  padding: 3px 8px;
  border-radius: 999px;
  background: #fff4e5;
  color: #c97a2c;
  font-size: 11px;
`;

const RecentStatus = styled.div`
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 999px;
  white-space: nowrap;
  ${({ $status }) =>
    $status === "성공"
      ? `
    background: #e7f9f1;
    color: #2c9a5b;
  `
      : `
    background: #fff1f1;
    color: #e05a5a;
  `}
`;
