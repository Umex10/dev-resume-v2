export const PROMPTS = ["arrow", "pure", "lambda"] as const;
export type PromptTheme = (typeof PROMPTS)[number];

export const FONT_SIZES = [
  { t: "S", v: 12 },
  { t: "M", v: 13 },
  { t: "L", v: 15 },
] as const;
export type FontSize = (typeof FONT_SIZES)[number]["v"];

export const CHIPS = [
  "help",
  "whoami",
  "neofetch",
  "jwt",
  "docker ps",
  "kubectl get pods",
  "open authkit",
  "accent orange",
  "sudo hire-me",
];

export const CMDS = [
  "help", "whoami", "about", "ls", "open", "neofetch", "stack", "jwt", "docker", "kubectl", "test",
  "thesis", "learning", "gpa", "now", "contact", "github", "theme", "prompt", "accent", "clear",
  "history", "date", "echo", "sudo", "exit",
];

export const EMAIL = "umi.dzinovic10@gmail.com";
export const GITHUB = "https://github.com/Umex10";

export const BOOT_LINES = [
  "resolving umex10.dev",
  "mounting ~/projects (6)",
  "compiling spring-boot + next.js",
  "pulling docker images",
  "warming up three.js",
  "hydrating zsh",
];

export const ROLES = [
  { w: "Backender", n: "// spring boot · jwt · postgres" },
  { w: "Frontender", n: "// next.js · react · shadcn" },
  { w: "Full-Stacker", n: "// api to pixel, both ends" },
  { w: "CI/CDer", n: "// docker · github actions" },
  { w: "Tester", n: "// junit · vitest · playwright" },
  { w: "Señior", n: "// one day I'm a full-stack Señior" },
];
