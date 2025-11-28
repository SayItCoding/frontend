// src/api/apiClient.js
import axios from "axios";

const LOCAL_URL = "http://localhost:3000";
const BASE_URL = "https://sayit-coding-production.up.railway.app";

const apiClient = axios.create({
  baseURL: LOCAL_URL,
  timeout: 30000, // 30초
});

// === 요청 인터셉터 ===
// JWT 토큰이 있으면 자동으로 Header에 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === 응답 인터셉터 ===
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 인증 만료 처리
    if (error.response?.status === 401) {
      console.warn("❗ 로그인 토큰 만료. 다시 로그인 필요");
      // 로그아웃 처리 or 로그인 페이지 이동 가능
      // window.location.href = "/login";
    }

    // 403, 404, 500 등도 필요하면 추가 처리 가능

    return Promise.reject(error); // 호출한 곳에서 catch 가능
  }
);

export default apiClient;
