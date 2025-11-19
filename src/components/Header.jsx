// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function Header() {
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <Inner>
        <Logo onClick={() => navigate("/")}>말해 코딩</Logo>

        <Nav>
          {/*<NavLink to="/mission">미션 체험</NavLink>*/}
          <NavLink to="/dashboard">대시보드</NavLink>

          <AuthButtons>
            <GhostButton onClick={() => navigate("/login")}>로그인</GhostButton>
            {/*<PrimarySmallButton onClick={() => navigate("/signup")}>
            회원가입
          </PrimarySmallButton>*/}
          </AuthButtons>
        </Nav>
      </Inner>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled.header`
  background: #4b7bec;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
`;

const Inner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-weight: 800;
  font-size: 20px;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavLink = styled(Link)`
  font-size: 14px;
  color: #e5edff;
  text-decoration: none;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 8px;
`;

const GhostButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #e5edff;
  background: transparent;
  font-size: 13px;
  color: #ffffff;
`;
