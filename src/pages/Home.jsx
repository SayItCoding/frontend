// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import MissionCard from "../components/MissionCard.jsx";
import { fetchMissionList } from "../api/mission.js"; // ✅ 추가

export default function Home() {
  const navigate = useNavigate();

  const [missions, setMissions] = useState([]); // ✅ API 데이터 저장
  const [loading, setLoading] = useState(true); // ✅ 로딩 상태
  const [error, setError] = useState(null); // ✅ 에러 상태

  useEffect(() => {
    async function loadMissions() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMissionList(1, 6); // page=1, limit=6 정도로 예시
        setMissions(data.items || []);
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
          <HeroTitle>말로 하는 블록코딩, 말해코딩</HeroTitle>
          <HeroSub>
            “앞으로 2칸 가”처럼 자연어로 말하면, 엔트리 블록이 자동으로
            만들어지는 코딩 학습 서비스예요.
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

      <CardsSection>
        <SectionTitle>추천 학습 미션</SectionTitle>

        {/*  로딩/에러/빈 상태 처리 */}
        {loading && <StatusText>미션을 불러오는 중입니다...</StatusText>}
        {error && !loading && <StatusText>{error}</StatusText>}
        {!loading && !error && missions.length === 0 && (
          <StatusText>아직 등록된 미션이 없어요.</StatusText>
        )}

        {!loading && !error && missions.length > 0 && (
          <CardGrid>
            {missions.map((m) => (
              <MissionCard
                key={m.id}
                title={m.title}
                desc={m.description}
                image={null} // API에 이미지 필드 없으니 일단 null
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

/* 스타일 (색은 너가 말한 팔레트 기준 느낌으로 예시) */

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
