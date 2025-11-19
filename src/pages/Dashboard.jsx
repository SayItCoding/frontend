// src/pages/DashboardPage.jsx
import React from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Dashboard() {
  const solved = 12;
  const totalProblems = 15;
  const accuracy = 76;
  const taskAchievement = 89;
  const totalStudyTime = "2시간 36분";

  return (
    <PageWrapper>
      <Header />
      <Content>
        {/* 상단: 프로필 + 출석 현황 */}
        <TopRow>
          <ProfileCard>
            <SmallLabel>말해 코딩</SmallLabel>
            <ProfileArea>
              <Avatar />
              <div>
                <Name>홍길동</Name>
              </div>
            </ProfileArea>
          </ProfileCard>

          <AttendanceCard>
            <SectionTitle>출석 현황</SectionTitle>
            <WeekRow>
              <WeekInfo>11월 4주차</WeekInfo>
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

        {/* 학습 정보 + 총 학습 시간 */}
        <MiddleRow>
          <StudyInfoCard>
            <RowHeader>
              <SectionTitle>학습 정보</SectionTitle>
            </RowHeader>

            <StudyInfoGrid>
              <InfoBlock>
                <InfoLabel>문제 풀이</InfoLabel>
                <ProblemCount>
                  <strong>{solved}</strong>/{totalProblems}개
                </ProblemCount>
                <ProgressBar>
                  <ProgressFill
                    style={{ width: `${(solved / totalProblems) * 100}%` }}
                  />
                </ProgressBar>
              </InfoBlock>

              <InfoBlockCenter>
                <InfoLabel>정답률</InfoLabel>
                <CircleWrapper>
                  <Ring value={accuracy}>
                    <RingInner>
                      <RingValue>{accuracy}%</RingValue>
                    </RingInner>
                  </Ring>
                </CircleWrapper>
              </InfoBlockCenter>

              <InfoBlockCenter>
                <InfoLabel>과제 달성률</InfoLabel>
                <CircleWrapper>
                  <Ring value={taskAchievement}>
                    <RingInner>
                      <RingValue>{taskAchievement}%</RingValue>
                    </RingInner>
                  </Ring>
                </CircleWrapper>
              </InfoBlockCenter>
            </StudyInfoGrid>
          </StudyInfoCard>

          <TotalTimeCard>
            <SectionTitle>총 학습 시간</SectionTitle>
            <TimeContent>
              <Hourglass>⏳</Hourglass>
              <TimeText>{totalStudyTime}</TimeText>
            </TimeContent>
            <MascotPlaceholder>🐯</MascotPlaceholder>
          </TotalTimeCard>
        </MiddleRow>

        {/* 컴퓨팅 사고력 역량 (대략적인 하단 섹션) */}
        <BottomSection>
          <SectionTitle>역량 분석</SectionTitle>
          <BottomGrid>
            <LargeCard>
              <LargeCardTitle>title1</LargeCardTitle>
              <LargeCirclePlaceholder>그래프 영역</LargeCirclePlaceholder>
            </LargeCard>

            <LargeCard>
              <LargeCardTitle>진단 결과 안내</LargeCardTitle>
              <LargeText>
                스스로의 강점과 보완점을 파악하고, 더 효과적인 학습을 할 수
                있어요. 지금 나의 능력을 진단해 보고, 성장 방향을 찾아보세요!
              </LargeText>
            </LargeCard>
          </BottomGrid>
        </BottomSection>
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
`;

const CardBase = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 28px;
  box-shadow: 0 8px 24px rgba(41, 45, 80, 0.06);
  box-sizing: border-box;
`;

const ProfileCard = styled(CardBase)`
  flex: 1.2;
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
  margin: 0 0 16px 0;
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

/* Middle row */

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
  align-items: center;
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

/* 총 학습 시간 카드 */

const TimeContent = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Hourglass = styled.div`
  font-size: 28px;
  opacity: 0.6;
`;

const TimeText = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #4f5cff;
`;

const MascotPlaceholder = styled.div`
  position: absolute;
  right: 24px;
  bottom: 10px;
  font-size: 64px;
  opacity: 0.3;
`;

/* 하단 섹션 */

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

const LargeCardTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const LargeCirclePlaceholder = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: #f2f3ff;
  color: #a0a5d0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
`;

const LargeText = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: #686d8f;
  margin: 0;
`;
