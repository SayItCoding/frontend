import { useEffect } from "react";

export function useHeadLinks(links, removeOnUnmount = false) {
  useEffect(() => {
    const created = [];
    links.forEach(({ href, ...rest }) => {
      let el = document.head.querySelector(
        `link[rel="stylesheet"][href="${href}"]`
      );
      if (!el) {
        el = document.createElement("link");
        el.rel = "stylesheet";
        el.href = href;
        Object.assign(el, rest);
        document.head.appendChild(el);
        created.push(el);
      }
    });
    return () => {
      if (removeOnUnmount)
        created.forEach((el) => el.parentNode?.removeChild(el));
    };
  }, [JSON.stringify(links), removeOnUnmount]);
}
