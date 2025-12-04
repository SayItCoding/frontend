// src/api/auth.js
// NestJS 컨트롤러(/api/v1/auth)와 연동되는 프론트엔드 인증 API 클라이언트
// - signup, login, refresh, logout, logoutDebug
// - 토큰 저장/조회 (localStorage)
// - authFetch: 자동 Authorization 헤더 + 401 시 1회 refresh 후 재시도

//const API_BASE = "https://sayit-coding-production.up.railway.app/api/v1/auth";
const API_BASE = "http://localhost:3000/api/v1/auth";

/* =========================
 * Token Storage Utilities
 * ========================= */
const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY) || "";
}
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY) || "";
}
export function setTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem(ACCESS_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
}
export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/* =========================
 * Low-level fetch helpers
 * ========================= */
async function baseFetch(url, options = {}) {
  const resp = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  return resp;
}

/**
 * 인증 필요한 요청에 사용:
 * - 자동으로 Bearer 토큰을 붙임
 * - 401이면 refresh 시도 후 1회 재시도
 */
export async function authFetch(url, options = {}) {
  const token = getAccessToken();
  const firstResp = await baseFetch(url, {
    ...options,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...(options.headers || {}),
    },
  });

  if (firstResp.status !== 401) return firstResp;

  // 401 → refresh 시도
  const refreshed = await tryRefresh();
  if (!refreshed) return firstResp; // refresh 실패 → 원응답 반환

  // 새 토큰으로 재시도
  const newToken = getAccessToken();
  return baseFetch(url, {
    ...options,
    headers: {
      Authorization: newToken ? `Bearer ${newToken}` : undefined,
      ...(options.headers || {}),
    },
  });
}

async function tryRefresh() {
  const rt = getRefreshToken();
  if (!rt) return false;

  try {
    const resp = await baseFetch(`${API_BASE}/refresh`, {
      method: "POST",
      body: JSON.stringify({ refresh_token: rt }),
    });
    if (!resp.ok) return false;

    const data = await resp.json();
    // { access_token, refresh_token }
    setTokens(data);
    return true;
  } catch {
    return false;
  }
}

/* =========================
 * Public API functions
 * ========================= */

/** 회원가입 */
export async function signup({ name, email, password }) {
  const resp = await baseFetch(`${API_BASE}/signup`, {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  if (!resp.ok) {
    const err = await safeJson(resp);
    throw new Error(err?.message || "회원가입 실패");
  }
  // 백엔드 예시 응답: { ok: true, userId, email }
  return resp.json();
}

/** 로그인 (토큰을 storage에 저장) */
export async function login({ email, password }) {
  const resp = await baseFetch(`${API_BASE}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!resp.ok) {
    const err = await safeJson(resp);
    throw new Error(err?.message || "로그인 실패");
  }
  const data = await resp.json(); // { access_token, refresh_token, user }
  setTokens(data);
  return data;
}

/** 수동 refresh (필요 시 직접 호출 가능) */
export async function refresh() {
  const rt = getRefreshToken();
  if (!rt) throw new Error("refresh_token이 없습니다.");
  const resp = await baseFetch(`${API_BASE}/refresh`, {
    method: "POST",
    body: JSON.stringify({ refresh_token: rt }),
  });
  if (!resp.ok) {
    const err = await safeJson(resp);
    throw new Error(err?.message || "토큰 재발급 실패");
  }
  const data = await resp.json(); // { access_token, refresh_token }
  setTokens(data);
  return data;
}

/** 로그아웃 (서버+클라이언트) */
export async function logout() {
  try {
    const resp = await authFetch(`${API_BASE}/logout`, { method: "POST" });
    // 서버에서 refreshTokenHash 제거 후 ok 반환 기대
    await safeJson(resp).catch(() => ({}));
  } finally {
    // 서버가 실패하더라도 클라이언트 토큰은 정리
    clearTokens();
  }
}

/** 디버그용: 현재 Bearer 액세스 토큰 검증 */
export async function logoutDebug() {
  const resp = await authFetch(`${API_BASE}/logout-debug`, { method: "POST" });
  if (!resp.ok) {
    const err = await safeJson(resp);
    throw new Error(err?.message || "logout-debug 실패");
  }
  return resp.json(); // { ok, decoded } or { ok:false, name, message }
}

/* =========================
 * Small utils
 * ========================= */
async function safeJson(resp) {
  try {
    return await resp.json();
  } catch {
    return null;
  }
}
