// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import MissionCard from "../components/MissionCard.jsx";
import { fetchMissionList } from "../api/mission.js";

export default function Home() {
  // 섹션별 데이터
  const [loopMissions, setLoopMissions] = useState([]); // 반복문
  const [conditionMissions, setConditionMissions] = useState([]); // 조건문

  // 카테고리별 로딩/에러 상태
  const [loopLoading, setLoopLoading] = useState(true);
  const [conditionLoading, setConditionLoading] = useState(true);
  const [loopError, setLoopError] = useState(null);
  const [conditionError, setConditionError] = useState(null);

  // Hero Preview 로딩 상태
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  // 반복문 미션 로딩
  useEffect(() => {
    async function loadLoopMissions() {
      try {
        setLoopLoading(true);
        setLoopError(null);

        const loopRes = await fetchMissionList(1, 3, "반복문");

        const items = (loopRes.items || []).map((m, idx) => ({
          ...m,
          thumbnailUrl: `/assets/images/missions/bg_1_${idx + 1}.png`,
        }));

        setLoopMissions(items);
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

        const conditionRes = await fetchMissionList(1, 3, "조건문");

        const items = (conditionRes.items || []).map((m, idx) => ({
          ...m,
          thumbnailUrl: `/assets/images/missions/bg_3_${idx + 1}.png`,
        }));

        setConditionMissions(items);
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
          <HeroTitle>말로 하는 코딩 학습, 말해 코딩</HeroTitle>
          <HeroSub>
            문제를 해결하는 절차를 말로 설명하며, 알고리즘을 직접 구성하고
            <br />
            기본적인 코딩 개념을 학습하는 알고리즘 중심의 코딩 학습 서비스예요.
          </HeroSub>
        </HeroText>

        <HeroPreview>
          {/* 배경 장식 원 */}
          <PreviewBackdrop />

          <PreviewBox>
            <PreviewHeader>
              <PreviewDots>
                <Dot />
                <Dot />
                <Dot />
              </PreviewDots>
              <PreviewTitle>학습 미션 화면</PreviewTitle>
            </PreviewHeader>

            <PreviewBody>
              {/* 로딩 중일 때 회색 스켈레톤 */}
              {!previewLoaded && <PreviewSkeleton />}

              {/* 실제 이미지 */}
              {!previewError && (
                <PreviewImage
                  src="/assets/images/mainPreview.png"
                  alt="말해코딩 서비스 화면 미리보기"
                  $loaded={previewLoaded}
                  onLoad={() => setPreviewLoaded(true)}
                  onError={() => {
                    setPreviewError(true);
                    setPreviewLoaded(true);
                  }}
                />
              )}

              {/* 실패 시 대체 */}
              {previewError && (
                <PreviewFallbackText>
                  화면 미리보기를 준비 중이에요.
                </PreviewFallbackText>
              )}
            </PreviewBody>
          </PreviewBox>
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
                    image={m.thumbnailUrl}
                    to={`/mission?missionId=${m.id}`}
                    difficulty={m.difficulty}
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
                      image={m.thumbnailUrl}
                      to={`/mission?missionId=${m.id}`}
                      difficulty={m.difficulty}
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

/* ===== 스타일 ===== */

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

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

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

const LearnHeader = styled.h2`
  width: 1062px;
  margin: 40px auto 0;
  padding-bottom: 29px;
  border-bottom: 1px solid #b9b9b9ff;
  font-size: 30px;
  font-weight: 400;
  color: #494949ff;
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
`;

const HeroPreview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const PreviewBackdrop = styled.div`
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 20%, #f3e7c5, #e0e7ff);
  opacity: 0.55;
  filter: blur(2px);
  transform: translate(10px, 10px);
  z-index: 0;
`;

const PreviewBox = styled.div`
  width: 100%;
  max-width: 420px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow: 0 16px 32px rgba(27, 43, 89, 0.18);
  border: 1px solid rgba(177, 167, 143, 0.2);
  overflow: hidden;
  position: relative;
  z-index: 1;
  transform: translateY(0);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(27, 43, 89, 0.22);
  }
`;

const PreviewHeader = styled.div`
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 10px;
  background: linear-gradient(90deg, #f8f8fb, #eef2ff);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
`;

const PreviewDots = styled.div`
  display: flex;
  gap: 6px;
`;

const Dot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #d6d6d6;
`;

const PreviewTitle = styled.span`
  font-size: 11px;
  color: #7a7a7a;
`;

const PreviewBody = styled.div`
  width: 100%;
  height: 230px;
  position: relative;
  background: #f3f4fa;
`;

const PreviewSkeleton = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 0;
  background: #e6e6e6;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${({ $loaded }) => ($loaded ? "block" : "none")};
`;

const PreviewFallbackText = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b1a78f;
  font-size: 14px;
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
