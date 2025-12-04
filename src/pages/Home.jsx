// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import MissionCard from "../components/MissionCard.jsx";
import { fetchMissionList } from "../api/mission.js";

export default function Home() {
  const navigate = useNavigate();

  // 섹션별 데이터
  const [loopMissions, setLoopMissions] = useState([]); // 반복문
  const [conditionMissions, setConditionMissions] = useState([]); // 조건문

  // 카테고리별 로딩/에러 상태
  const [loopLoading, setLoopLoading] = useState(true);
  const [conditionLoading, setConditionLoading] = useState(true);
  const [loopError, setLoopError] = useState(null);
  const [conditionError, setConditionError] = useState(null);

  // 반복문 미션 로딩
  useEffect(() => {
    async function loadLoopMissions() {
      try {
        setLoopLoading(true);
        setLoopError(null);

        // 로딩 테스트
        function sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await sleep(2000);

        const loopRes = await fetchMissionList(1, 6, "반복문");
        setLoopMissions(loopRes.items || []);
      } catch (err) {
        console.error(err);
        setLoopError("반복문 미션 목록을 불러오는 데 실패했어요.");
      } finally {
        setLoopLoading(false);
      }
    }

    loadLoopMissions();
  }, []);

  // 조건문 미션 로딩
  useEffect(() => {
    async function loadConditionMissions() {
      try {
        setConditionLoading(true);
        setConditionError(null);

        const conditionRes = await fetchMissionList(1, 6, "조건문");
        setConditionMissions(conditionRes.items || []);
      } catch (err) {
        console.error(err);
        setConditionError("조건문 미션 목록을 불러오는 데 실패했어요.");
      } finally {
        setConditionLoading(false);
      }
    }

    loadConditionMissions();
  }, []);

  return (
    <Page>
      <Header />

      <Hero>
        <HeroText>
          <HeroTitle>말로 하는 코딩, 말해코딩</HeroTitle>
          <HeroSub>
            “앞으로 2칸 가”처럼 자연어로 말하면, 코드가 자동으로 만들어지는 코딩
            학습 서비스예요.
          </HeroSub>
          <HeroButtons>
            {/*<PrimaryButton onClick={() => navigate("/mission")}>
              체험 미션 시작하기
            </PrimaryButton>*/}
            <GhostButton onClick={() => navigate("/dashboard")}>
              내 학습 현황 보기
            </GhostButton>
          </HeroButtons>
        </HeroText>

        <HeroPreview>
          <PreviewBox>화면 미리보기</PreviewBox>
        </HeroPreview>
      </Hero>

      <LearnHeader>말해 코딩 학습하기</LearnHeader>

      <RowList>
        {/* 반복문 섹션 */}
        {(loopLoading || loopError || loopMissions.length > 0) && (
          <Row>
            <SectionTitle>반복문 미션</SectionTitle>

            {/* 로딩 중 → 스켈레톤 */}
            {loopLoading && (
              <CardGrid>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <MissionCard key={`loop-skeleton-${idx}`} loading />
                ))}
              </CardGrid>
            )}

            {/* 에러 */}
            {loopError && !loopLoading && <StatusText>{loopError}</StatusText>}

            {/* 데이터 있을 때만 카드 렌더 */}
            {!loopLoading && !loopError && loopMissions.length > 0 && (
              <CardGrid>
                {loopMissions.map((m) => (
                  <MissionCard
                    key={m.id}
                    title={m.title}
                    desc={m.description}
                    image={"/temp_thumb.png"}
                    to={`/mission?missionId=${m.id}`}
                  />
                ))}
              </CardGrid>
            )}
          </Row>
        )}

        {/* 조건문 섹션 */}
        {(conditionLoading ||
          conditionError ||
          conditionMissions.length > 0) && (
          <Row>
            <SectionTitle>조건문 미션</SectionTitle>

            {/* 로딩 중 → 스켈레톤 */}
            {conditionLoading && (
              <CardGrid>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <MissionCard key={`cond-skeleton-${idx}`} loading />
                ))}
              </CardGrid>
            )}

            {/* 에러 */}
            {conditionError && !conditionLoading && (
              <StatusText>{conditionError}</StatusText>
            )}

            {/* 데이터 있을 때만 카드 */}
            {!conditionLoading &&
              !conditionError &&
              conditionMissions.length > 0 && (
                <CardGrid>
                  {conditionMissions.map((m) => (
                    <MissionCard
                      key={m.id}
                      title={m.title}
                      desc={m.description}
                      image={"/temp_thumb.png"}
                      to={`/mission?missionId=${m.id}`}
                    />
                  ))}
                </CardGrid>
              )}
          </Row>
        )}
      </RowList>

      <Footer />
    </Page>
  );
}

/* 스타일 그대로 유지 */

const Page = styled.div`
  min-height: 100vh;
  background: #f5f7fb;
  display: flex;
  flex-direction: column;
`;

const Hero = styled.main`
  max-width: 1120px;
  margin: 40px auto 32px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 32px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const HeroText = styled.div``;

const HeroTitle = styled.h1`
  font-size: 36px;
  margin-bottom: 12px;
  color: #3e3e3e;
`;

const HeroSub = styled.p`
  font-size: 15px;
  color: #5a5140;
  line-height: 1.6;
`;

const HeroButtons = styled.div`
  margin-top: 24px;
  display: flex;
  gap: 12px;
`;

const GhostButton = styled.button`
  padding: 12px 20px;
  border-radius: 999px;
  border: 1px solid #3e3e3e;
  background: transparent;
  color: #3e3e3e;
`;

const HeroPreview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LearnHeader = styled.h2`
  width: 1062px;
  margin: 40px auto 0;
  padding-bottom: 29px;
  border-bottom: 1px solid #ced4da;
  font-size: 30px;
  font-weight: 400;
  color: #343a40;
  line-height: 34px;

  @media (max-width: 1100px) {
    width: 100%;
    padding: 0 20px 29px;
  }
`;

const RowList = styled.div`
  width: 1062px;
  margin: 24px auto 40px;

  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 1100px) {
    width: 100%;
    padding: 0 20px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 40px;
`;

const PreviewBox = styled.div`
  width: 100%;
  max-width: 360px;
  height: 220px;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b1a78f;
  font-size: 14px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 4px;
  color: #3e3e3e;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StatusText = styled.p`
  font-size: 14px;
  color: #5a5140;
  padding: 8px 0;
`;
