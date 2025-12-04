// src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();

  const { authenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <HeaderWrapper>
      <Inner>
        <Logo onClick={() => navigate("/")}>말해 코딩</Logo>

        <Nav>
          <NavLink to="/dashboard">대시보드</NavLink>

          {!authenticated ? (
            <AuthButtons>
              <GhostButton onClick={() => navigate("/login")}>
                로그인
              </GhostButton>
            </AuthButtons>
          ) : (
            <AuthButtons>
              <UserName>{user?.name}님</UserName>
              <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
            </AuthButtons>
          )}
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
  gap: 16px;
  margin-left: 8px;
`;

const GhostButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #e5edff;
  background: transparent;
  font-size: 13px;
  color: #ffffff;
  cursor: pointer;
`;

const LogoutButton = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #e5edff;
  background: transparent;
  font-size: 13px;
  color: #ffffff;
  cursor: pointer;
`;

const UserName = styled.span`
  font-size: 13px;
  color: #fff;
  display: flex;
  align-items: center;
`;
