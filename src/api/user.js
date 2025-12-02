import apiClient from "./apiClient";

export async function fetchMyProfile() {
  const res = await apiClient.get("/api/v1/users/me");
  return res.data; // { id, email, name, roles, studyStreak, lastStudyDate, createdAt }
}
