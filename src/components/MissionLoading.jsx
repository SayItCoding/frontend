// src/components/MissionLoading.jsx
import React from "react";
import styled, { keyframes } from "styled-components";

export default function MissionLoading() {
  return (
    <LoadingRoot>
      <Content>
        <CharacterImageWrapper>
          <CharacterImage
            src={"/assets/images/loading.png"}
            alt="말해 코딩 캐릭터"
          />
        </CharacterImageWrapper>

        <TextBlock>
          <Title>미션을 준비하고 있어요</Title>
          <Sub>
            학습에 필요한 정보와 실행 환경을 불러오고 있어요
            <br />
            잠시만 기다려 주세요
          </Sub>
        </TextBlock>
      </Content>
    </LoadingRoot>
  );
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LoadingRoot = styled.div`
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(
    circle at top left,
    #e8f0ff 0,
    #f5f6f8 45%,
    #eef1ff 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  opacity: ${({ $fadeOut }) => ($fadeOut ? 0 : 1)};
  pointer-events: ${({ $fadeOut }) => ($fadeOut ? "none" : "auto")};
  transition: opacity 0.5s ease-out;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const CharacterImageWrapper = styled.div`
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  overflow: hidden;
`;

const CharacterImage = styled.img`
  width: 125px;
  height: 125px;
  object-fit: contain;
`;

const TextBlock = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1f2933;
  margin: 0 0 6px;
`;

const Sub = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
`;
