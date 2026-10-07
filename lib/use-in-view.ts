"use client";

import { useEffect, useState, type RefObject } from "react";

/** IntersectionObserver as a hook. With `once`, it stays true after the first hit. */
export function useInView(ref: RefObject<Element | null>, { rootMargin = "0px", threshold = 0, once = false } = {}): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (once && e.isIntersecting) io.disconnect();
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, threshold, once]);
  return inView;
}
