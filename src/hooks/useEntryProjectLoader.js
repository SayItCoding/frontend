// src/hooks/useEntryProjectLoader.js
import { useState, useEffect } from "react";
import { fetchMissionDetail } from "../api/mission";

/**
 * 미션 ID로부터 projectData를 가져오는 훅
 * Entry.init은 여기서 하지 않고,
 * 컴포넌트에서 projectData를 받아서 Entry.loadProject를 호출하는 구조.
 */
export function useEntryProjectLoader({ missionId }) {
  const [projectData, setProjectData] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState("");

  useEffect(() => {
    if (!missionId) return;

    async function load() {
      try {
        setProjectLoading(true);
        setProjectError("");

        const data = await fetchMissionDetail(missionId);
        // 백엔드에서 내려주는 projectData (없을 수도 있음)
        //console.log(data);
        setProjectData(data.projectData || null);
      } catch (err) {
        console.error("❌ mission projectData 로드 실패:", err);
        setProjectError(err.message || "프로젝트를 불러오지 못했습니다.");
      } finally {
        setProjectLoading(false);
      }
    }

    load();
  }, [missionId]);

  return { projectData, projectLoading, projectError };
}
