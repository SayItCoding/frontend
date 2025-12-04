import apiClient from "./apiClient";

/*
 * 출석 현황 및 학습 시간
 * GET /api/v1/study-sessions/summary?weekOffset=0
 */

export async function fetchStudySummary(weekOffset = 0) {
  const response = await apiClient.get(
    `/api/v1/study-sessions/summary?weekOffset=${weekOffset}`
  );
  return response.data;
}

export async function fetchStudyInsights({ mode, weekOffset }) {
  const res = await apiClient.get("/api/v1/dashboard/study-insights", {
    params:
      mode === "overall" ? { mode: "overall" } : { mode: "week", weekOffset },
  });
  return res.data;
}

export async function fetchRecentMissions({ page = 1, limit = 6 } = {}) {
  const res = await apiClient.get("/api/v1/dashboard/recent-missions", {
    params: { page, limit },
  });
  return res.data;
}

export async function fetchMissionSummary() {
  const res = await apiClient.get("/api/v1/dashboard/mission-summary");
  return res.data;
}
