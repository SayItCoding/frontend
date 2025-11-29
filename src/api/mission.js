import apiClient from "./apiClient";

/**
 * 학습 미션 목록 조회
 * GET /api/v1/missions?page={page}&limit={limit}
 */
export async function fetchMissionList(page = 1, limit = 20, category) {
  const params = { page, limit };

  if (category) {
    params.category = category;
  }

  try {
    const res = await apiClient.get("/api/v1/missions", { params });
    return res.data; // items, meta, links
  } catch (err) {
    console.error("❌ fetchMissionList 오류:", err);
    throw err;
  }
}

/**
 * 학습 미션 상세 조회
 * GET /api/v1/missions/{missionId}
 */
export async function fetchMissionDetail(missionId) {
  if (!missionId && missionId !== 0) {
    throw new Error("missionId는 필수 값입니다.");
  }

  try {
    const res = await apiClient.get(`/api/v1/missions/${missionId}`);
    return res.data; // 단일 미션 객체
  } catch (err) {
    console.error("❌ fetchMissionDetail 오류:", err);
    throw err;
  }
}

/**
 * 미션별 사용자 대화 내역 조회
 * GET /api/v1/missions/{missionId}/chats?page={pageNum}&limit={limit}
 */
export async function fetchMissionChats(missionId, page = 1, limit = 20) {
  if (!missionId && missionId !== 0) {
    throw new Error("missionId는 필수 값입니다.");
  }

  try {
    const res = await apiClient.get(
      `/api/v1/missions/${missionId}/chats?page=${page}&limit=${limit}`
    );
    return res.data; // { items, meta, links }
  } catch (err) {
    console.error("❌ fetchMissionChats 오류:", err);
    throw err;
  }
}

/**
 * 사용자 입력을 전송하고, AI 응답을 함께 받는 API
 * POST /api/v1/missions/{missionId}/chats
 */
export async function sendMissionChat(missionId, userInput, selectedCodeId) {
  if (!missionId && missionId !== 0) {
    throw new Error("missionId는 필수 값입니다.");
  }
  if (!userInput || !userInput.trim()) {
    throw new Error("content는 비어 있을 수 없습니다.");
  }

  const body = {
    selectedCodeId,
    content: userInput,
    selectedCodeId,
  };

  const res = await apiClient.post(`/api/v1/missions/${missionId}/chats`, body);

  // 201 Created + 응답 JSON
  return res.data; // { missionId, userMissionId, missionCodeId, items, projectData}
}

/**
 * 특정 미션의 특정 missionCode 상세 조회 API
 * GET /api/v1/missions/{missionId}/mission-codes/{missionCodeId}
 */
export async function fetchMissionCode(missionId, missionCodeId) {
  if (!missionId && missionId !== 0) {
    throw new Error("missionId는 필수 값입니다.");
  }
  if (!missionCodeId && missionCodeId !== 0) {
    throw new Error("missionCodeId는 필수 값입니다.");
  }

  const res = await apiClient.get(
    `/api/v1/missions/${missionId}/mission-codes/${missionCodeId}`
  );

  // 200 OK + missionCode 상세 JSON
  return res.data; // { missionId, missionCodeId , projectData, createdAt }
}
