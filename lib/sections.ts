export const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "shell", label: "Shell" },
  { id: "work", label: "Work" },
  { id: "status", label: "Status" },
  { id: "ship", label: "Ship" },
  { id: "stack", label: "Stack" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
