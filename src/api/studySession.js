import apiClient from "./apiClient";

/**
 * 학습 세션 시작
 * POST /api/v1/study-sessions
 * @param {{ missionId?: number }} params
 * @returns {Promise<{ id: number; userId: number; missionId: number | null; durationSeconds: number; startedAt: string; endedAt: string | null }>}
 */
export async function startStudySession(params = {}) {
  const { missionId } = params;

  const response = await apiClient.post("/api/v1/study-sessions", {
    // missionId는 선택값
    missionId: typeof missionId === "number" ? missionId : undefined,
  });

  return response.data;
}

/**
 * 학습 세션 종료
 * PATCH /api/v1/study-sessions/:sessionId/end
 * @param {number} sessionId
 * @returns {Promise<{ id: number; userId: number; missionId: number | null; durationSeconds: number; startedAt: string; endedAt: string | null }>}
 */
export async function endStudySession(sessionId) {
  if (!sessionId) {
    throw new Error("세션 종료를 위해 sessionId가 필요합니다.");
  }

  const response = await apiClient.patch(
    `/api/v1/study-sessions/${sessionId}/end`
  );

  return response.data;
}
