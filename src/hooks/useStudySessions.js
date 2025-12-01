// src/hooks/useStudySession.js
import { useEffect, useRef } from "react";
import { startStudySession, endStudySession } from "../api/studySession";

/**
 * EntryMission 화면 등에서
 * - missionId 가 유효한 number일 때만 세션 시작
 * - 언마운트 시 세션 종료
 */
export function useStudySession(missionId) {
  const sessionIdRef = useRef(null);

  useEffect(() => {
    // 1) missionId 가 아직 준비되지 않았다면 아무 것도 하지 않음
    if (missionId == null || Number.isNaN(missionId)) {
      return;
    }

    let isCancelled = false;

    async function openSession() {
      try {
        const session = await startStudySession({ missionId });
        if (!isCancelled) {
          sessionIdRef.current = session.id;
          // console.log("[StudySession] started:", session);
        }
      } catch (error) {
        console.error("[StudySession] 세션 시작 실패:", error);
      }
    }

    openSession();

    // cleanup: 언마운트 시 세션 종료
    return () => {
      isCancelled = true;
      const currentSessionId = sessionIdRef.current;
      if (!currentSessionId) return;

      // fire-and-forget
      endStudySession(currentSessionId).catch((error) => {
        console.error("[StudySession] 세션 종료 실패:", error);
      });
    };
  }, [missionId]);
}
