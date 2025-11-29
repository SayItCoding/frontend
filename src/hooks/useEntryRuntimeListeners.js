// src/hooks/useEntryRuntimeListeners.js
import { useEffect, useState } from "react";

/**
 * 실행 중인 블록 하이라이트
 */
export function useEntryBlockHighlight({ enabled, lastBlockId }) {
  useEffect(() => {
    if (!enabled) return;
    const Entry = window.Entry;
    if (!Entry || typeof Entry.addEventListener !== "function") {
      console.warn("[useEntryBlockHighlight] Entry.addEventListener 없음");
      return;
    }

    let lastTarget = null;

    function clearHighlight() {
      if (lastTarget && lastTarget.classList) {
        lastTarget.classList.remove("entry-executing-highlight");
      }
      lastTarget = null;
      const remains = document.querySelectorAll("g.entry-executing-highlight");
      remains.forEach((el) => el.classList.remove("entry-executing-highlight"));
    }

    function getBlockIdFromView(blockView) {
      return (
        blockView?.block?.data?.id ??
        blockView?.data?.id ??
        blockView?.id ??
        null
      );
    }

    function highlightBlockView(blockView) {
      const blockId = getBlockIdFromView(blockView);
      if (!blockId) return;

      const path = document.querySelector(
        `svg path.blockPath[blockId="${blockId}"]`
      );
      if (!path) return;

      const g = path.closest("g");
      if (!g || !g.classList) return;

      clearHighlight();
      g.classList.add("entry-executing-highlight");
      lastTarget = g;
    }

    const handleBlockExecute = (blockView) => {
      highlightBlockView(blockView);

      const currentId =
        blockView?.data?.id ?? blockView?.block?.data?.id ?? blockView?.id;
      if (currentId && lastBlockId && currentId === lastBlockId) {
        console.log("[useEntryBlockHighlight] 마지막 블록 실행 완료");
      }
    };

    const handleStop = () => {
      clearHighlight();
    };

    Entry.addEventListener("blockExecute", handleBlockExecute);
    Entry.addEventListener("stop", handleStop);

    return () => {
      try {
        if (typeof Entry.removeEventListener === "function") {
          Entry.removeEventListener("blockExecute", handleBlockExecute);
          Entry.removeEventListener("stop", handleStop);
        }
      } catch (e) {
        console.warn("[useEntryBlockHighlight] 리스너 제거 중 오류:", e);
      }
      clearHighlight();
    };
  }, [enabled, lastBlockId]);
}

/**
 * blockExecute 침묵 + pause 상태가 아닌 경우 실행 종료 감지
 * - run 시점과 blockExecute 시점마다 idle 타이머 리셋
 * - 일정 시간(blockExecute 없음) 지나면 onEnd 1회 호출
 */
export function useEntryRunEndBySilence({
  enabled,
  idleMs = 300,
  resultRef,
  setResult,
}) {
  useEffect(() => {
    if (!enabled) return;
    const Entry = window.Entry;
    if (!Entry || typeof Entry.addEventListener !== "function") {
      console.warn("[useEntryRunEndBySilence] Entry.addEventListener 없음");
      return;
    }

    let idleTimer = null;
    let currentRunId = 0;
    let endedRunId = null;

    function clearTimer() {
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = null;
      }
    }

    function onEnd() {
      const current = resultRef.current;
      if (current === "success" || current === "fail") {
        return;
      }
      setResult("fail");
    }

    function startIdleTimer() {
      clearTimer();

      idleTimer = setTimeout(() => {
        try {
          const engine = Entry.engine;
          const state = engine?.state;

          // pause면 "일시정지"일 뿐, 끝난게 아님
          if (state === "pause") return;

          if (endedRunId === currentRunId) return;
          endedRunId = currentRunId;

          onEnd();
        } catch (e) {
          console.warn("[useEntryRunEndBySilence] idle 체크 중 오류:", e);
        }
      }, idleMs);
    }

    const handleRun = () => {
      currentRunId += 1;
      endedRunId = null;
      startIdleTimer();
    };

    const handleBlockExecute = () => {
      startIdleTimer();
    };

    const handleStop = () => {
      clearTimer();
      if (endedRunId === currentRunId) return;
      endedRunId = currentRunId;
      onEnd();
    };

    Entry.addEventListener("run", handleRun);
    Entry.addEventListener("blockExecute", handleBlockExecute);
    Entry.addEventListener("stop", handleStop);

    return () => {
      try {
        Entry.removeEventListener("run", handleRun);
        Entry.removeEventListener("blockExecute", handleBlockExecute);
        Entry.removeEventListener("stop", handleStop);
      } catch (e) {
        console.warn("[useEntryRunEndBySilence] 리스너 제거 중 오류:", e);
      }
      clearTimer();
    };
  }, [enabled, idleMs, resultRef, setResult]);
}

/**
 * Entry에서 선택된 블록을 주기적으로 감지
 */
export function useEntrySelectedBlock(enabled) {
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setSelectedBlock(null);
      return;
    }

    let lastSelectedId = null;
    const interval = setInterval(() => {
      let svgGroup = document.querySelectorAll("g.svgBlockGroup");
      svgGroup = svgGroup[1]; // 두 번째 요소
      if (!svgGroup) {
        if (lastSelectedId !== null) {
          lastSelectedId = null;
          setSelectedBlock(null);
        }
        return;
      }

      const selectedEl = svgGroup.querySelector(".block.selected");
      if (!selectedEl) {
        if (lastSelectedId !== null) {
          lastSelectedId = null;
          setSelectedBlock(null);
        }
        return;
      }

      const currentId =
        selectedEl.getAttribute("id") || selectedEl.dataset?.id || null;

      if (currentId === lastSelectedId) return;
      lastSelectedId = currentId;

      setSelectedBlock(
        currentId
          ? {
              id: currentId,
              el: selectedEl,
            }
          : null
      );
    }, 100);

    return () => clearInterval(interval);
  }, [enabled]);

  return selectedBlock;
}

/**
 * goal / outOfMap 커스텀 이벤트를 result에 반영
 */
export function useMissionResultEvents({ setResult, resultRef }) {
  useEffect(() => {
    const handleReachedGoal = () => {
      resultRef.current = "success";
      setResult("success");
    };

    const handleOutOfMap = () => {
      resultRef.current = "fail";
      setResult("fail");
    };

    window.addEventListener("entry_reachedGoal", handleReachedGoal);
    window.addEventListener("entry_outOfMap", handleOutOfMap);

    return () => {
      window.removeEventListener("entry_reachedGoal", handleReachedGoal);
      window.removeEventListener("entry_outOfMap", handleOutOfMap);
    };
  }, [setResult, resultRef]);
}
