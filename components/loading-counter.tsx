"use client";

import { useEffect, useState } from "react";
import { OpenerScreen } from "./opener";

/** The opener's counter and progress line, faster, for route loading states. */
export function LoadingCounter() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPct((p) => (p >= 100 ? 0 : Math.min(100, p + 4 + Math.random() * 8))), 40);
    return () => clearInterval(id);
  }, []);
  return <OpenerScreen pct={pct} lines={[]} leaving={false} />;
}
