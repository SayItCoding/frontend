// src/stores/useMissionDetailStore.js
import { create } from "zustand";
import { fetchMissionDetail } from "../api/mission";

export const useMissionDetailStore = create((set, get) => ({
  mission: null, // 현재 미션 상세 전체
  loading: false,
  error: null,

  // missionId로 상세 로드
  async loadMission(missionId) {
    if (!missionId) return;

    const current = get().mission;
    // 같은 미션이면 재요청 스킵
    if (current && String(current.id) === String(missionId)) {
      return;
    }

    set({ loading: true, error: null });

    try {
      const data = await fetchMissionDetail(missionId);
      set({ mission: data, loading: false, error: null });
    } catch (err) {
      console.error("[useMissionDetailStore] loadMission error:", err);
      set({
        loading: false,
        error: err,
      });
    }
  },

  clearMission() {
    set({ mission: null, loading: false, error: null });
  },
}));
