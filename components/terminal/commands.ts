import { PROJECTS, findProject } from "@/content/projects";
import { TOOL_GROUPS } from "@/content/stack";
import { CMDS, EMAIL, PROMPTS, type PromptTheme } from "@/content/terminal";
import { ACCENTS, isAccent, type Accent, type Theme } from "@/lib/accent";

/** a = accent · m = mute · r = accent2 · i = ink · g = green */
export type Tone = "a" | "m" | "r" | "i" | "g";
export type Seg = { t: string; c: Tone };
export type Line = { k: "cmd"; t: string } | { k: "out"; s: Seg[] } | { k: "neo" };

export type Effect =
  | { type: "open"; id: string }
  | { type: "theme"; value: Theme }
  | { type: "accent"; value: Accent }
  | { type: "prompt"; value: PromptTheme }
  | { type: "github" }
  | { type: "mail" };

export type Ctx = { history: string[]; theme: Theme; now: Date };
export type Result = { lines: Line[]; effects: Effect[]; clear?: boolean };

type Part = string | [string, Tone];
export const O = (...parts: Part[]): Line => ({
  k: "out",
  s: parts.map((p) => (typeof p === "string" ? { t: p, c: "i" } : { t: p[0], c: p[1] })),
});
const GAP: Line = { k: "out", s: [{ t: " ", c: "m" }] };

const HELP: [string, string][] = [
  ["whoami", "who is this"],
  ["about", "the longer version"],
  ["ls", "list projects"],
  ["open <project>", "deep dive into a project"],
  ["neofetch", "system info, but it is me"],
  ["stack", "tools I use"],
  ["jwt", "HS256 vs RS256, the short version"],
  ["docker ps", "what is running"],
  ["kubectl get pods", "what I am learning"],
  ["test", "run the test suites"],
  ["thesis", "my bachelor thesis"],
  ["gpa", "grades"],
  ["contact", "how to reach me"],
  ["theme dark|light", "switch theme"],
  ["prompt arrow|pure|lambda", "change the prompt"],
  ["accent " + ACCENTS.join("|"), "recolor the whole site"],
  ["clear", "clear the screen"],
];

function output(c: string, c0: string, rest: string[], arg: string, ctx: Ctx): Result {
  const effects: Effect[] = [];
  const done = (...lines: Line[]): Result => ({ lines, effects });
  switch (c) {
    case "help":
      return done(O(["commands", "a"]), ...HELP.map(([a, b]) => O(["  " + a.padEnd(40), "a"], [b, "m"])));
    case "whoami":
      return done(O(["Umejr Dzinovic", "a"], " (umex10) — Next.js & Spring Boot developer, software engineering student in Graz, Austria."));
    case "about":
    case "cat":
      return done(O("Spring Boot and Next.js are my strengths. I build Spring Boot APIs with stateless JWT auth — I spent months on JWT alone, HS256 and RS256 — and the Next.js apps on top: proxy/middleware, Server Actions, instrumentation. Everything runs in Docker and ships through CI/CD, tested with JUnit, Vitest and Playwright. Right now I am writing my bachelor thesis and learning Kubernetes, gRPC and microservices."));
    case "ls":
      return done(O(...PROJECTS.map((p): Part => [p.id + "/   ", "a"])));
    case "open":
    case "cd": {
      const p = findProject(rest[0] ?? "");
      if (!p) return done(O(["open: no such project: " + (rest[0] ?? ""), "r"]), O(["try: ", "m"], [PROJECTS.map((x) => x.id).join("  "), "a"]));
      effects.push({ type: "open", id: p.id });
      return done(O(["→ ", "a"], "opening " + p.name + " deep dive …"));
    }
    case "neofetch":
      return done({ k: "neo" });
    case "stack":
    case "skills":
      return done(...TOOL_GROUPS.map((g) => O(["  " + g.label.padEnd(12), "m"], g.items.join(" · "))));
    case "jwt":
      return done(
        O(["HS256", "a"], ["  one shared secret signs and verifies. simple, fast — every verifier can also sign.", "m"]),
        O(["RS256", "a"], ["  private key signs, public key verifies. services check tokens without being able to mint them.", "m"]),
        O(["  AuthKit speaks both. Overex uses RS256 so every microservice verifies on its own.", "i"]),
      );
    case "docker":
      return done(
        O(["CONTAINER ID   IMAGE                    STATUS         PORTS", "m"]),
        O(["3f2a91c0d4e1   ", "a"], "authkit-backend:latest   Up 2 hours     0.0.0.0:8080->8080"),
        O(["8b7e10aa53f2   ", "a"], "postgres:16              Up 2 hours     5432/tcp"),
        O(["c41d0e9f7a22   ", "a"], "swaggerapi/swagger-ui    Up 2 hours     0.0.0.0:8081->8080"),
      );
    case "kubectl":
      return done(
        O(["NAME                                 READY   STATUS    RESTARTS", "m"]),
        O(["auth-service-6f9c8d7b4-x2k1p       ", "a"], " 1/1     Running   0"),
        O(["order-service-7d4b9c6f8-m8q3z      ", "a"], " 1/1     Running   0"),
        O(["inventory-service-5c8f7d9b6-a1b2c  ", "a"], " 1/1     Running   0"),
        O(["inventory-service-5c8f7d9b6-d3e4f  ", "a"], " 1/1     Running   0"),
        O(["# overex — still learning k8s, be gentle", "m"]),
      );
    case "test":
      return done(
        O(["✓ ", "g"], "backend   ", ["JUnit 5 + MockMvc + Spring Security Test", "m"]),
        O(["✓ ", "g"], "web       ", ["Vitest + Testing Library", "m"]),
        O(["✓ ", "g"], "e2e       ", ["Playwright", "m"]),
      );
    case "thesis":
    case "now":
      return done(
        O(["● writing ", "a"], "my bachelor thesis — Overex, flash-sale ticketing on Kubernetes."),
        O(["  how do pessimistic locking, optimistic locking, Redis and queues hold up against overselling", "m"]),
        O(["  when the ticket service scales to 1, 3, 5 and 10 replicas?", "m"]),
        O(["  → open overex", "a"]),
      );
    case "learning":
      return done(O(["learning right now  ", "m"], ["Kubernetes · gRPC · Microservices", "a"]));
    case "gpa":
    case "grades":
      return done(
        O(["Ø 1.20", "a"], "  ", ["███████████████████░", "a"], ["  Austrian scale, 1 is the best grade", "m"]),
        O(["Software Engineering · FH JOANNEUM, Graz", "m"]),
      );
    case "contact":
      return done(O(["  mail    ", "m"], [EMAIL, "a"]), O(["  github  ", "m"], ["github.com/Umex10", "a"]));
    case "github":
      effects.push({ type: "github" });
      return done(O(["→ opening github.com/Umex10", "a"]));
    case "theme": {
      const t: Theme = arg === "light" || arg === "dark" ? arg : ctx.theme === "dark" ? "light" : "dark";
      effects.push({ type: "theme", value: t });
      return done(O(["theme → ", "m"], [t, "a"]));
    }
    case "prompt": {
      const v = arg === "λ" ? "lambda" : arg;
      if (!(PROMPTS as readonly string[]).includes(v)) return done(O(["usage: prompt arrow|pure|lambda", "r"]));
      effects.push({ type: "prompt", value: v as PromptTheme });
      return done(O(['# PROMPT_THEME="' + v + '" written to ~/.zshrc', "m"]));
    }
    case "accent":
      if (!isAccent(arg)) return done(O(["usage: accent " + ACCENTS.join("|"), "r"]));
      effects.push({ type: "accent", value: arg });
      return done(O(['# ACCENT="' + arg + '" — the whole site follows', "m"]));
    case "history":
      return done(...ctx.history.map((h, i) => O([String(i + 1).padStart(4) + "  ", "m"], h)));
    case "date":
      return done(O(ctx.now.toString()));
    case "echo":
      return done(O(rest.join(" ")));
    case "sudo":
      if (!arg.includes("hire")) return done(O(["recruiter is not in the sudoers file. try ", "r"], ["sudo hire-me", "a"]));
      effects.push({ type: "mail" });
      return done(O(["[sudo] password for recruiter: ********", "m"]), O(["access granted. ", "g"], "opening your mail client …"));
    case "rm":
      return done(O(["nice try. this resume is immutable.", "r"]));
    case "vim":
    case "nano":
      return done(O(["blocked for your own safety. nobody leaves vim.", "m"]));
    case "exit":
      return done(O(["there is no escape. try ", "m"], ["contact", "a"], [" instead.", "m"]));
    default:
      return done(O(["zsh: command not found: " + c0, "r"]), O(["type ", "m"], ["help", "a"], [" for a list of commands", "m"]));
  }
}

/** Runs one command line. Pure: side effects are returned, not performed. */
export function run(raw: string, ctx: Ctx): Result {
  const cmd = raw.trim();
  const echo: Line = { k: "cmd", t: cmd };
  if (!cmd) return { lines: [echo], effects: [] };
  const [c0, ...rest] = cmd.split(/\s+/);
  const c = c0.toLowerCase();
  if (c === "clear") return { lines: [], effects: [], clear: true };
  const res = output(c, c0, rest, rest.join(" ").toLowerCase(), { ...ctx, history: [...ctx.history, cmd] });
  return { ...res, lines: [echo, ...res.lines, GAP] };
}

const ARGS: Record<string, string[]> = {
  accent: ACCENTS,
  prompt: [...PROMPTS],
  theme: ["dark", "light"],
  docker: ["ps"],
  kubectl: ["get pods"],
};

/** Tab completion: a unique match fills the input, several matches are listed. */
export function complete(input: string): { input?: string; list?: string[] } {
  const [a, ...more] = input.split(" ");
  if (more.length === 0) {
    const m = CMDS.filter((c) => c.startsWith(a));
    if (m.length === 1) return { input: m[0] + " " };
    return m.length > 1 ? { list: m } : {};
  }
  const b = more.join(" ");
  const pool = ARGS[a] ?? PROJECTS.map((p) => p.id);
  const m = pool.filter((x) => x.startsWith(b));
  return m.length === 1 ? { input: a + " " + m[0] } : m.length > 1 ? { list: m } : {};
}
