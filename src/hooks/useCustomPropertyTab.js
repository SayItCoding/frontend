// src/hooks/useCustomPropertyTab.js
import { useEffect, useState } from "react";

export function useCustomPropertyTab({ key, label }) {
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    let tabRoot = null;
    let el = null;
    let destroyed = false;

    function setup() {
      tabRoot = document.querySelector(".propertyTab");
      if (!tabRoot || destroyed) return false;

      el = document.createElement("div");
      el.className = "propertyTabElement propertyTabCustom";
      el.dataset.key = key;
      el.textContent = label;

      tabRoot.appendChild(el);
      tabRoot.prepend(el); // 맨 위로 올리기

      const applySelect = () => {
        tabRoot
          .querySelectorAll(".propertyTabElement")
          .forEach((node) => node.classList.remove("selected"));

        el.classList.add("selected");
        setSelected(true);
      };

      const handleCustomClick = () => applySelect();

      const handleRootClick = (e) => {
        const tab = e.target.closest(".propertyTabElement");
        if (!tab) return;
        if (tab !== el) {
          el.classList.remove("selected");
          setSelected(false);
        }
      };

      el.addEventListener("click", handleCustomClick);
      tabRoot.addEventListener("click", handleRootClick);

      // 처음 로드시 자동 선택
      applySelect();

      // cleanup 함수 리턴
      return () => {
        if (!tabRoot) return;
        el.removeEventListener("click", handleCustomClick);
        tabRoot.removeEventListener("click", handleRootClick);
        if (el.parentNode) el.parentNode.removeChild(el);
      };
    }

    // 바로 시도해 보고, 안 되면 폴링
    let cleanup = setup();
    if (cleanup) {
      return () => cleanup();
    }

    const interval = setInterval(() => {
      if (cleanup) return;
      cleanup = setup();
      if (cleanup) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      destroyed = true;
      clearInterval(interval);
      if (cleanup) cleanup();
    };
  }, [key, label]);

  return { selected };
}
