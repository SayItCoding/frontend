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
import { fetchMyProfile } from "../api/user";

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
  const [user, setUser] = useState(null); // UserProfileDto 형태로 사용
  const [ready, setReady] = useState(false); // 초기 상태 로딩 완료 여부
  const [authenticated, setAuthenticated] = useState(false);
  const refreshTimerRef = useRef(null);

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

        // refresh 시에는 토큰 기반 최소 정보만 유지 (필요하면 fetchMyProfile 붙여도 됨)
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

  // 초기 토큰 검사 & /me로 프로필 복구
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const at = getAccessToken();
      const rt = getRefreshToken();

      if (!at) {
        setAuthenticated(false);
        setUser(null);
        setReady(true);
        return;
      }

      const payload = decodeJWT(at);
      const expMs = getExpMs(at);
      const isValid = !!payload && expMs > nowMs();

      if (!isValid) {
        // 만료된 토큰이면 깔끔하게 정리
        doLocalLogout();
        setReady(true);
        return;
      }

      setAuthenticated(true);
      scheduleRefresh(at, rt);

      try {
        // 서버에 저장된 내 프로필 가져오기
        const profile = await fetchMyProfile(); // GET /api/v1/users/me
        if (!cancelled) {
          setUser(profile); // { id, email, name, roles, studyStreak, ... }
        }
      } catch (e) {
        // /me 실패하면 최소한 JWT 기반 정보라도 세팅
        if (!cancelled) {
          setUser(payload ? { id: payload.sub, email: payload.email } : null);
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    };

    init();

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
      cancelled = true;
      window.removeEventListener("storage", onStorage);
      clearRefreshTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Public APIs ---
  const login = useCallback(
    async ({ email, password }) => {
      const data = await apiLogin({ email, password });
      // data: { access_token, refresh_token, user? }
      const payload = decodeJWT(data.access_token);
      setAuthenticated(!!payload);

      if (data.user) {
        // 백엔드 LoginResponseDto에 들어있는 UserProfileDto 그대로 사용
        setUser(data.user);
      } else {
        // 혹시 user를 안 내려주는 경우 대비
        setUser(payload ? { id: payload.sub, email: payload.email } : null);
      }

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
