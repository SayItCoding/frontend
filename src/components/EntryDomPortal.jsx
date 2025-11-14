// src/components/EntryDomPortal.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * EntryDomPortal
 * props.target: "#entryCategoryTab" 또는 ".propertyPanel" 같은 CSS selector
 * props.children: 해당 DOM에 삽입할 React UI
 */
export default function EntryDomPortal({ target, children }) {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (!target) return;

    const tryFind = () => {
      const node = document.querySelector(target);
      if (node) {
        setContainer(node);
      } else {
        // Entry DOM은 init 이후에 생기므로 반복 탐색 필요
        setTimeout(tryFind, 100);
      }
    };

    tryFind();
  }, [target]);

  if (!container) return null;
  return createPortal(children, container);
}
