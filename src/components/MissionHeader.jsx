// src/components/MissionHeader.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/useAuth";

export default function MissionHeader({ enabled }) {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setTarget(null);
      return;
    }

    let destroyed = false;

    function tryFind() {
      const el = document.querySelector(".entryTopFloatingView");
      if (!el || destroyed) return false;

      // 기존 엔트리 상단 UI 제거
      const scene = el.querySelector(".entrySceneWorkspace");
      const blockCount = el.querySelector(".entryBlockCountView");
      if (scene) scene.remove();
      if (blockCount) blockCount.remove();

      // 상단바 영역을 MissionHeader 전용으로 설정
      el.style.display = "block";
      el.style.position = "absolute";
      el.style.top = "0";
      el.style.left = "0";
      el.style.width = "100%";
      el.style.height = "38px"; // 고정 높이
      el.style.zIndex = "10";

      setTarget(el);
      return true;
    }

    if (tryFind()) return;

    const interval = setInterval(() => {
      if (tryFind()) clearInterval(interval);
    }, 200);

    return () => {
      destroyed = true;
      clearInterval(interval);
    };
  }, [enabled]);

  if (!enabled || !target) return null;

  return createPortal(<MissionHeaderBar />, target);
}

function MissionHeaderBar() {
  const navigate = useNavigate();
  const { authenticated, user } = useAuth();

  return (
    <HeaderWrapper>
      <Inner>
        <Logo onClick={() => navigate("/")}>말해 코딩</Logo>

        <Nav>
          <NavLink to="/dashboard">대시보드</NavLink>

          {!authenticated ? (
            <AuthButtons></AuthButtons>
          ) : (
            <AuthButtons>
              <UserName>{user?.name}님</UserName>
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

  height: 38px; /* 🔥 상단바 높이 고정 */
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

const Inner = styled.div`
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const NavLink = styled(Link)`
  font-size: 13px; /* 기존 14px → 살짝 줄임 */
  color: #e5edff;
  text-decoration: none;
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: 8px;
`;

const UserName = styled.span`
  font-size: 12px;
  color: #fff;
`;
