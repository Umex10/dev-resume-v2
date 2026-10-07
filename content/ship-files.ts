import type { KeyFile } from "./types";

export const SHIP_FILES: KeyFile[] = [
  {
    name: "ci.yml",
    path: ".github/workflows/ci.yml",
    note: "Every push runs both test suites. Only green builds on main get an image and a deploy.",
    source: "ship/ci.yml",
    lang: "yaml",
  },
  {
    name: "Dockerfile",
    path: "apps/backend/Dockerfile",
    note: "Multi-stage: the JDK builds the jar, only a slim JRE ships.",
    source: "ship/Dockerfile",
    lang: "docker",
  },
  {
    name: "docker-compose.yml",
    path: "docker-compose.yml",
    note: "One docker compose up: Postgres, the backend and a mirrored Swagger UI.",
    source: "ship/docker-compose.yml",
    lang: "yaml",
  },
];

/** Code behind the work preview — real excerpts, top to bottom per column. */
export const FLASHLIGHT: { title: string; source: string }[][] = [
  [
    { title: "chatex/backend/src/main/java/org/devtiro/chatex/ChatexApplication.java", source: "flashlight/ChatexApplication.java" },
    { title: "chatex/backend/…/security/JwtAuthenticationFilter.java", source: "flashlight/JwtAuthenticationFilter.java" },
  ],
  [{ title: "authkit/apps/backend/…/auth/security/config/SecurityConfig.java", source: "flashlight/SecurityConfig.java" }],
  [
    { title: "authkit/apps/web/app/layout.tsx", source: "flashlight/layout.tsx" },
    { title: "authkit/apps/web/redux/api/apis/auth.ts — silent refresh", source: "flashlight/auth.ts" },
  ],
  [
    { title: "dsa-exercises/two-sum/Solution.java", source: "flashlight/TwoSum.java" },
    { title: "authkit/docker-compose.yml", source: "flashlight/docker-compose.yml" },
  ],
];
