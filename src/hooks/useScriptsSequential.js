import { useEffect, useState } from "react";

export function useScriptsSequential(srcs, opts = {}) {
  const { async = true, defer = true, removeOnUnmount = false } = opts;
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!srcs?.length) return;
    let cancelled = false;
    const appended = [];

    const loadOne = (src) =>
      new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = async;
        s.defer = defer;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(s);
        appended.push(s);
      });

    (async () => {
      try {
        setStatus("loading");
        for (const src of srcs) {
          if (cancelled) return;
          await loadOne(src);
        }
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      if (removeOnUnmount)
        appended.forEach((s) => s.parentNode?.removeChild(s));
    };
  }, [JSON.stringify(srcs), async, defer, removeOnUnmount]);

  return status;
}
