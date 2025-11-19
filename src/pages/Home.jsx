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
  const [recommended, setRecommended] = useState([]); // 추천 학습 미션
  const [loopMissions, setLoopMissions] = useState([]); // 반복문
  const [conditionMissions, setConditionMissions] = useState([]); // 조건문
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    async function loadMissions() {
      try {
        setLoading(true);
        setError(null);

        // 추천(전체) 반복문(LOOP) 조건문(CONDITION) 한 번에 요청
        const [recommendedRes, loopRes, conditionRes] = await Promise.all([
          fetchMissionList(1, 6), // 추천용: 전체에서 상위 6개
          fetchMissionList(1, 6, "반복문"), // 반복문 카테고리
          fetchMissionList(1, 6, "조건문"), // 조건문 카테고리
        ]);

        setRecommended(recommendedRes.items || []);
        setLoopMissions(loopRes.items || []);
        setConditionMissions(conditionRes.items || []);
      } catch (err) {
        console.error(err);
        setError("미션 목록을 불러오는 데 실패했어요.");
      } finally {
        setLoading(false);
      }
    }

    loadMissions();
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

      {/* === 섹션 1: 추천 학습 미션 (전체) === */}
      <CardsSection>
        <SectionTitle>추천 학습 미션</SectionTitle>

        {loading && <StatusText>미션을 불러오는 중입니다...</StatusText>}
        {error && !loading && <StatusText>{error}</StatusText>}
        {!loading && !error && recommended.length === 0 && (
          <StatusText>아직 등록된 미션이 없어요.</StatusText>
        )}

        {!loading && !error && recommended.length > 0 && (
          <CardGrid>
            {recommended.map((m) => (
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
      </CardsSection>

      {/* === 섹션 2: 반복문 미션 === */}
      <CardsSection>
        <SectionTitle>반복문 미션</SectionTitle>

        {loading && <StatusText>미션을 불러오는 중입니다...</StatusText>}
        {error && !loading && <StatusText>{error}</StatusText>}
        {!loading && !error && loopMissions.length === 0 && (
          <StatusText>반복문 미션이 아직 없어요.</StatusText>
        )}

        {!loading && !error && loopMissions.length > 0 && (
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
      </CardsSection>

      {/* === 섹션 3: 조건문 미션 === */}
      <CardsSection>
        <SectionTitle>조건문 미션</SectionTitle>

        {loading && <StatusText>미션을 불러오는 중입니다...</StatusText>}
        {error && !loading && <StatusText>{error}</StatusText>}
        {!loading && !error && conditionMissions.length === 0 && (
          <StatusText>조건문 미션이 아직 없어요.</StatusText>
        )}

        {!loading && !error && conditionMissions.length > 0 && (
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
      </CardsSection>

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

const CardsSection = styled.section`
  max-width: 1120px;
  margin: 0 auto 40px;
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 16px;
  color: #3e3e3e;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const StatusText = styled.p`
  font-size: 14px;
  color: #5a5140;
  padding: 8px 0;
`;
