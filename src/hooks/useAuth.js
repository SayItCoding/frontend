// src/hooks/useAuth.js
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  login as apiLogin,
  signup as apiSignup,
  refresh as apiRefresh,
  logout as apiLogout,
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "../api/auth";

// --- Small helpers ---
function decodeJWT(token) {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getExpMs(token) {
  const payload = decodeJWT(token);
  return payload?.exp ? payload.exp * 1000 : 0;
}

function nowMs() {
  return Date.now();
}

// --- Context ---
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {id,email,name}? 서버 응답 구조에 맞게 사용
  const [ready, setReady] = useState(false); // 초기 상태 로딩 완료 여부
  const [authenticated, setAuthenticated] = useState(false);
  const refreshTimerRef = useRef(null);

  // 초기 토큰 검사 & 유저 디코딩
  useEffect(() => {
    const at = getAccessToken();
    const rt = getRefreshToken();

    if (at) {
      const payload = decodeJWT(at);
      setAuthenticated(!!payload);
      // 서버에서 로그인 시 user를 함께 내려주는 경우가 많음.
      // 여기선 토큰의 email/sub만 사용 (필요시 /me 호출로 대체 가능)
      setUser(payload ? { id: payload.sub, email: payload.email } : null);
      scheduleRefresh(at, rt);
    } else {
      setAuthenticated(false);
      setUser(null);
    }
    setReady(true);

    // 다른 탭과 동기화
    const onStorage = (e) => {
      if (e.key === "access_token" || e.key === "refresh_token") {
        const nat = getAccessToken();
        const nrt = getRefreshToken();
        if (!nat) {
          clearRefreshTimer();
          setAuthenticated(false);
          setUser(null);
        } else {
          const payload = decodeJWT(nat);
          setAuthenticated(!!payload);
          setUser(payload ? { id: payload.sub, email: payload.email } : null);
          scheduleRefresh(nat, nrt);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearRefreshTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 리프레시 타이머 설정 (만료 60초 전에 시도)
  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  const scheduleRefresh = (accessToken, refreshToken) => {
    clearRefreshTimer();
    if (!accessToken || !refreshToken) return;

    const expMs = getExpMs(accessToken);
    if (!expMs) return;

    const lead = 60 * 1000; // 60s before expiration
    const delay = Math.max(0, expMs - nowMs() - lead);

    refreshTimerRef.current = setTimeout(async () => {
      try {
        const data = await apiRefresh(); // { access_token, refresh_token }
        setTokens(data);
        const payload = decodeJWT(data.access_token);
        setAuthenticated(!!payload);
        setUser(payload ? { id: payload.sub, email: payload.email } : null);
        scheduleRefresh(data.access_token, data.refresh_token);
      } catch {
        // refresh 실패 → 세션 종료
        doLocalLogout();
      }
    }, delay);
  };

  const doLocalLogout = () => {
    clearRefreshTimer();
    clearTokens();
    setAuthenticated(false);
    setUser(null);
  };

  // --- Public APIs ---
  const login = useCallback(
    async ({ email, password }) => {
      const data = await apiLogin({ email, password });
      // data: { access_token, refresh_token, user? }
      const payload = decodeJWT(data.access_token);
      setAuthenticated(!!payload);
      setUser(
        data.user ??
          (payload ? { id: payload.sub, email: payload.email } : null)
      );
      scheduleRefresh(data.access_token, data.refresh_token);
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signup = useCallback(async ({ name, email, password }) => {
    // 보통은 OK만 반환 → 필요시 login까지 자동으로 이어갈 수도 있음
    return apiSignup({ name, email, password });
  }, []);

  const refresh = useCallback(async () => {
    const data = await apiRefresh();
    const payload = decodeJWT(data.access_token);
    setAuthenticated(!!payload);
    setUser(payload ? { id: payload.sub, email: payload.email } : null);
    scheduleRefresh(data.access_token, data.refresh_token);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      doLocalLogout();
    }
  }, []);

  const value = useMemo(
    () => ({
      ready,
      authenticated,
      user,
      login,
      signup,
      refresh,
      logout,
      // 유틸
      getAccessToken,
      getRefreshToken,
    }),
    [ready, authenticated, user, login, signup, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
