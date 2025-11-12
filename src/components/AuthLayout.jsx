import React from "react";
import styled from "styled-components";

export default function AuthLayout({ children }) {
  return (
    <Page>
      <LeftHero>
        <Brand>
          <Logo src="/icons/icon.png" alt="logo" />
          <Title>
            <img src="/icons/title-icon.png" alt="service title" />
          </Title>
          <Subtitle>계정으로 로그인하고 프로젝트를 시작하세요.</Subtitle>
        </Brand>
        <HeroArt aria-hidden />
      </LeftHero>
      <RightAuth>{children}</RightAuth>
    </Page>
  );
}

const Page = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 100vh;
  background: ${({ theme }) => theme?.background ?? "#f5f6f8"};
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;
const LeftHero = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  padding: 64px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  @media (max-width: 1100px) {
    padding: 40px 24px 16px;
  }
`;
const Brand = styled.div`
  z-index: 1;
  max-width: 640px;
`;
const Logo = styled.img`
  width: 72px;
  height: 72px;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
`;
const Title = styled.div`
  margin-top: 16px;
  img {
    height: 48px;
    object-fit: contain;
  }
`;
const Subtitle = styled.p`
  margin-top: 12px;
  font-size: 18px;
  color: #475569;
`;
const HeroArt = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(#c7d2fe 1px, transparent 1px);
  background-size: 18px 18px;
  opacity: 0.35;
`;
const RightAuth = styled.section`
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  padding: 32px;
  background: #fff;
  @media (max-width: 1100px) {
    padding: 16px;
  }
`;
