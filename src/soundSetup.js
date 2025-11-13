/* global createjs */
//사운드 처리용, 사운드 관련 에러가 떠서(The buffer passed to decodeAudioData contains an unknown content type.)
//이거로 고쳐지지 않음
//추측: EntryJS 또는 다른 외부 라이브러리가 내부적으로 Web Audio API를 쓰면서 이미 실패한 buffer를 decode하려고 한다? 예상
//이게 맞다면 외부 문제이지 웹사이트 문제는 없음
export const initSound = () => {
  try {
    if (window.createjs && createjs.Sound) {
      // 더미 오디오 등록
      createjs.Sound.registerSound("/audio/mixkit-game-level-completed-2059.mp3", "dummy", () => {
        console.log("✅ Dummy sound loaded successfully");
      });

      // 로드 이벤트
      createjs.Sound.addEventListener("fileload", (event) => {
        console.log(`🎵 Loaded sound: ${event.id}`);
      });

      // 에러 이벤트 (개발용)
      createjs.Sound.addEventListener("error", (event) => {
        console.warn("⚠️ SoundJS loading error (safe to ignore in dev):", event);
      });
    }
  } catch (err) {
    console.warn("⚠️ SoundJS init error (safe to ignore):", err);
  }
};
