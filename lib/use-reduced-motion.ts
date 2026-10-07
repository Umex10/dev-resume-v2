"use client";

import { useMedia } from "./use-media";

export const useReducedMotion = () => useMedia("(prefers-reduced-motion: reduce)");
