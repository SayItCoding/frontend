// src/hooks/useEntryProjectLoader.js
import { useState, useEffect, useMemo } from "react";
import { useMissionDetailStore } from "../stores/useMissionDetailStore";

/**
 * missionId 기반으로:
 *  - zustand에서 미션 상세를 로드/조회하고
 *  - mission.projectData 를 projectData로 꺼내주는 훅
 */
export function useEntryProjectLoader({ missionId }) {
  const { mission, loading, error, loadMission } = useMissionDetailStore();

  // missionId 변경 시, zustand 스토어로 로드 요청
  useEffect(() => {
    if (!missionId) return;
    loadMission(missionId);
  }, [missionId, loadMission]);

  const projectData = useMemo(() => mission?.projectData ?? null, [mission]);

  // 필요하면 mission도 함께 리턴해서 EntryScreen, ChatWindow 등에서 재사용
  return {
    mission,
    projectData,
    projectLoading: loading,
    projectError: error
      ? error.message || "프로젝트를 불러오지 못했습니다."
      : "",
  };
}
