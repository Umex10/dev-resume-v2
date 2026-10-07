import type { ToolGroup } from "./types";

export const TOOL_GROUPS: ToolGroup[] = [
  { label: "Strengths", items: ["Spring Boot", "Next.js", "JWT · HS256 / RS256", "Spring Security"] },
  { label: "Languages", items: ["Java", "TypeScript", "JavaScript", "SQL", "HTML/CSS", "YAML"] },
  { label: "Backend", items: ["REST", "WebSocket", "JPA", "Swagger", "PostgreSQL", "Firebase"] },
  { label: "Frontend", items: ["React 19", "Server Actions", "proxy / middleware", "instrumentation", "Tailwind", "shadcn/ui", "RTK Query"] },
  { label: "Mobile", items: ["React Native", "Expo"] },
  { label: "Testing", items: ["JUnit 5", "MockMvc", "Vitest", "Testing Library", "Playwright"] },
  { label: "Ship", items: ["Docker", "Docker Compose", "GitHub Actions", "CI/CD", "Railway", "Vercel", "Git"] },
  { label: "Learning", items: ["Kubernetes", "gRPC", "Microservices", "Redis", "Kafka"] },
];

export const SPHERE_TAGS = [
  "Spring Boot", "Next.js", "Java", "TypeScript", "JWT", "Spring Security", "Docker", "Kubernetes",
  "gRPC", "PostgreSQL", "React", "React Native", "JUnit 5", "Vitest", "Playwright", "GitHub Actions",
  "Tailwind", "shadcn/ui", "RTK Query", "Firebase", "WebSocket", "Redis", "Kafka", "Vercel",
  "Railway", "Linux", "Git", "Expo",
];
