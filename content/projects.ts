import type { Project } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "overex",
    no: "01",
    name: "Overex",
    kind: "Project work + bachelor thesis",
    repo: "",
    live: "",
    urlText: "overex — in progress · FH JOANNEUM",
    shots: false,
    tagline: "Flash-sale ticketing that stays up under load and never oversells — on Kubernetes.",
    overview:
      'When sought-after tickets drop, thousands of people hit "buy" at the same moment. Overex is a ticketing platform built for exactly that moment: Spring Boot microservices that talk over gRPC and scale on Kubernetes. The project work builds the platform; the bachelor thesis then compares four strategies against overselling once the ticket path runs as many replicas.',
    highlights: [
      "Services: auth (from AuthKit), event, order, inventory + gateway",
      "gRPC between order-service and inventory-service — REST for browser ↔ backend, gRPC for service ↔ service",
      "auth-service issues RS256 JWTs; every other service verifies them itself with the public key",
      "Kubernetes scales the ticket path under load and restarts crashed replicas",
      "Thesis: pessimistic vs. optimistic locking vs. Redis reservation vs. queue — correctness, throughput and latency at 1, 3, 5 and 10 replicas",
    ],
    arch: ["Next.js", "Gateway", "auth · event · order", "gRPC", "inventory", "PostgreSQL"],
    stack: ["Java 21", "Spring Boot", "Microservices", "gRPC", "Kubernetes", "Docker", "PostgreSQL", "JWT RS256", "Next.js", "Redis", "Kafka"],
    files: [
      {
        name: "inventory.proto",
        path: "proto/inventory.proto",
        note: "The contract between order-service and inventory-service. Binary and typed — it feels like calling a Java method on another machine.",
        source: "overex/inventory.proto",
        lang: "proto",
        planned: true,
      },
      {
        name: "ReservationStrategy.java",
        path: "inventory-service/…/reservation/ReservationStrategy.java",
        note: "Strategy pattern: pessimistic, optimistic, Redis and queue share one interface, so the same load test runs against each of them.",
        source: "overex/ReservationStrategy.java",
        lang: "java",
        planned: true,
      },
      {
        name: "inventory-hpa.yaml",
        path: "k8s/inventory-hpa.yaml",
        note: "Kubernetes adds replicas under flash-sale load. That solves stability — and is exactly what makes overselling harder.",
        source: "overex/inventory-hpa.yaml",
        lang: "yaml",
        planned: true,
      },
    ],
  },
  {
    id: "authkit",
    no: "02",
    name: "AuthKit",
    kind: "Authentication microservice",
    repo: "authkit",
    live: "",
    shots: true,
    tagline: "A drop-in auth microservice — one Spring Boot API, two interchangeable clients.",
    overview:
      "A reusable, drop-in authentication microservice — clone it, start it, and you have working sign-up, sign-in, JWT sessions, roles, Swagger and tests on day one. A Spring Boot backend with two interchangeable frontends, a Next.js web app and a React Native (Expo) app, that implement the same production-style auth flow. Written from scratch after months of working through JWT in depth.",
    highlights: [
      "JWT in depth: HS256 with a shared secret and RS256 with a private / public key pair",
      "Short-lived access token (15 min) + refresh token (30 days) in an HTTP-only cookie",
      "Stateless SecurityFilterChain with JwtAuthFilter before UsernamePasswordAuthenticationFilter",
      "Role-based authorization (USER / ADMIN) via @PreAuthorize, protected GET /me",
      "Next.js 16 proxy.ts route protection + Server Actions; RTK Query silent refresh on both clients",
      "Tests everywhere: JUnit 5 + MockMvc, Vitest + Testing Library, Playwright e2e — one docker compose up to run",
    ],
    arch: ["Next.js · Expo", "RTK Query", "JwtAuthFilter", "Spring Boot", "PostgreSQL"],
    stack: ["Java 21", "Spring Boot 4", "Spring Security", "JJWT", "HS256 / RS256", "PostgreSQL", "Next.js 16", "React Native", "RTK Query", "JUnit 5", "Vitest", "Playwright", "Docker"],
    files: [
      {
        name: "SecurityConfig.java",
        path: "apps/backend/…/auth/security/config/SecurityConfig.java",
        note: "The one SecurityFilterChain: stateless, explicit route rules, and JwtAuthFilter inserted before UsernamePasswordAuthenticationFilter.",
        source: "authkit/SecurityConfig.java",
        lang: "java",
      },
      {
        name: "JwtAuthFilter.java",
        path: "apps/backend/…/auth/security/JwtAuthFilter.java",
        note: "Runs once per request: pulls the Bearer token, validates it, and puts the user into the SecurityContext for every controller downstream.",
        source: "authkit/JwtAuthFilter.java",
        lang: "java",
      },
      {
        name: "JwtService.java",
        path: "apps/backend/…/auth/JwtService.java",
        note: "HS256 signs and verifies with one shared secret. RS256 swaps getSigningKey() for a private / public key pair, so other services can verify with the public key alone — the basis for Overex.",
        source: "authkit/JwtService.java",
        lang: "java",
      },
      {
        name: "proxy.ts",
        path: "apps/web/proxy.ts",
        note: "Next.js 16 renamed middleware.ts to proxy.ts — route protection runs before any page renders.",
        source: "authkit/proxy.ts",
        lang: "ts",
      },
    ],
  },
  {
    id: "chatex",
    no: "03",
    name: "Chatex",
    kind: "Social website",
    repo: "chatex",
    live: "",
    shots: true,
    tagline: "Shouts, reshouts and real-time chat on a fully stateless security chain.",
    overview:
      "A social website with a full auth system. Users post Shouts with likes, reshouts, quotes and comments, follow each other, chat over WebSocket, and manage their accounts — avatar, banner, bio, location.",
    highlights: [
      "Stateless Spring Security chain — CSRF disabled, CORS locked to the frontend origin",
      "Custom JwtAuthenticationFilter (OncePerRequestFilter) validates the Bearer token on every request",
      "SecurityContextHolder gives every downstream controller the authenticated user",
      "Access token 15 min + refresh token 30 days in an HttpOnly cookie",
      "Real-time chat over WebSocket",
    ],
    arch: ["Next.js + Redux", "JwtAuthenticationFilter", "Spring Boot", "WebSocket", "PostgreSQL"],
    stack: ["Next.js", "TypeScript", "Spring Boot", "Spring Security", "JWT", "PostgreSQL", "Redux", "WebSocket", "shadcn/ui", "Docker"],
    files: [
      {
        name: "SecurityConfig.java",
        path: "backend/…/config/SecurityConfig.java",
        note: "The Security-Chain: stateless, CSRF off, CORS locked to the Next.js origin, custom filter in front.",
        source: "chatex/SecurityConfig.java",
        lang: "java",
      },
      {
        name: "JwtAuthenticationFilter.java",
        path: "backend/…/security/JwtAuthenticationFilter.java",
        note: "OncePerRequest filter: Bearer token → JWT validation → SecurityContextHolder.",
        source: "chatex/JwtAuthenticationFilter.java",
        lang: "java",
      },
      {
        name: "WebSocketConfig.java",
        path: "backend/…/config/WebSocketConfig.java",
        note: "Chat runs over STOMP on WebSocket next to the REST API — the JWT is checked again on CONNECT.",
        source: "chatex/WebSocketConfig.java",
        lang: "java",
      },
    ],
  },
  {
    id: "renderex",
    no: "04",
    name: "Renderex",
    kind: "AI note-taking",
    repo: "renderex",
    live: "",
    shots: true,
    tagline: "Modern note-taking where markdown meets AI.",
    overview:
      "Firebase handles the entire backend — auth, database, protected routes, user-scoped data — all without running a server. Google Gemini is wired in for context-aware content generation.",
    highlights: [
      "Serverless backend on Firebase: auth, database, protected routes, user-scoped data",
      "Every Server Action checks the session with requireUserId; Firebase Admin initialises once per server",
      "Google Gemini for context-aware content generation",
      "Export to PDF, DOCX, Markdown or plain text, full tag system, dark/light theme",
    ],
    arch: ["Next.js + Redux", "Server Actions", "Firebase", "Gemini API"],
    stack: ["Next.js", "TypeScript", "Firebase", "Redux", "Gemini AI", "Framer Motion", "Tailwind"],
    files: [
      {
        name: "requireUserId.ts",
        path: "src/lib/auth/requireUserId.ts",
        note: "Every notes, tags and user Server Action starts here — no session cookie, no data.",
        source: "renderex/requireUserId.ts",
        lang: "ts",
      },
      {
        name: "admin.ts",
        path: "src/lib/firebase/admin.ts",
        note: "Firebase Admin initialises once per server instance, so Server Actions get privileged Firestore and Auth access without a backend of my own.",
        source: "renderex/admin.ts",
        lang: "ts",
      },
      {
        name: "ai.ts",
        path: "src/actions/ai.ts",
        note: "Gemini runs inside a Server Action, so the API key never reaches the browser.",
        source: "renderex/ai.ts",
        lang: "ts",
      },
    ],
  },
  {
    id: "dsa",
    no: "05",
    name: "DSA Solutions",
    kind: "LeetCode & algorithms",
    repo: "dsa-exercises-website",
    live: "",
    shots: true,
    tagline: "Solved LeetCode issues, documented with time and space complexity.",
    overview:
      "A dedicated website documenting solved LeetCode issues and Data Structures & Algorithms exercises. Every solution is written in Java with an in-depth explanation and a precise time and memory complexity analysis.",
    highlights: [
      "Solutions, notes and code pulled straight from the exercises repo via the GitHub API",
      "Every solution in Java with an explanation of the underlying logic",
      "Time and memory complexity analysis per issue",
      "Filtering system to search and sort issues by difficulty",
    ],
    arch: ["dsa-exercises repo", "GitHub API", "Next.js", "Filter + search"],
    stack: ["Java", "Next.js", "Algorithms", "DSA", "GitHub API", "Tailwind"],
    files: [
      {
        name: "github.ts",
        path: "lib/github.ts",
        note: "Solutions are not copied into the site — they are read from the exercises repo and revalidated every minute.",
        source: "dsa/github.ts",
        lang: "ts",
      },
      {
        name: "Solution.java",
        path: "dsa-exercises/two-sum/Solution.java",
        note: "Two Sum in one pass with a hash map — O(n) time, noted in the solution's write-up next to the code.",
        source: "dsa/Solution.java",
        lang: "java",
      },
    ],
  },
  {
    id: "devresume",
    no: "06",
    name: "Dev-Resume v1",
    kind: "Personal site",
    repo: "dev-resume",
    live: "https://dev-resume-sigma.vercel.app",
    shots: true,
    tagline: "The first version of this site — intro, apps, skills and a working contact form.",
    overview:
      "My developer resume as a single-page site: intro, availability, apps, skills and a working contact form that sends mail through Resend. Built with Next.js 16 and React 19.",
    highlights: [
      "Animated with Framer Motion",
      "Charts via Recharts",
      "Contact form validated with Zod + react-hook-form",
      "Mail delivery through Resend from a Server Action",
    ],
    arch: ["react-hook-form", "Zod", "Server Action", "Resend"],
    stack: ["Next.js", "React 19", "TypeScript", "Framer Motion", "Recharts", "Resend", "Zod", "Tailwind"],
    files: [
      {
        name: "send.ts",
        path: "src/actions/send.ts",
        note: "A Server Action instead of an API route — the form calls send() directly.",
        source: "devresume/send.ts",
        lang: "ts",
      },
      {
        name: "email.ts",
        path: "src/lib/email.ts",
        note: "Resend delivers the mail; failures come back as a value the form can show.",
        source: "devresume/email.ts",
        lang: "ts",
      },
      {
        name: "formSchema.ts",
        path: "src/lib/formSchema.ts",
        note: "One schema shared by react-hook-form and the Server Action.",
        source: "devresume/formSchema.ts",
        lang: "ts",
      },
    ],
  },
];

export function findProject(q: string): Project | undefined {
  const s = q.toLowerCase().replace(/\/$/, "");
  if (!s) return undefined;
  return PROJECTS.find((p) => p.id === s || p.repo === s || p.name.toLowerCase().startsWith(s));
}

export function projectIndex(id: string): number {
  return PROJECTS.findIndex((p) => p.id === id);
}

export const repoUrl = (p: Project) => `https://github.com/Umex10/${p.repo}`;
export const previewUrl = (p: Project) => p.urlText ?? `github.com/Umex10/${p.repo}`;
