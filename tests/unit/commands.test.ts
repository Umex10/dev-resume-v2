import { describe, expect, it } from "vitest";
import { complete, run, type Line } from "@/components/terminal/commands";

const ctx = { history: [], theme: "dark" as const, now: new Date("2026-10-06T12:00:00Z") };
const text = (lines: Line[]) => lines.map((l) => (l.k === "out" ? l.s.map((s) => s.t).join("") : l.k === "cmd" ? `$ ${l.t}` : "<neofetch>")).join("\n");

describe("terminal commands", () => {
  it("echoes the command and lists help", () => {
    const r = run("help", ctx);
    expect(r.lines[0]).toEqual({ k: "cmd", t: "help" });
    expect(text(r.lines)).toContain("open <project>");
    expect(text(r.lines)).toContain("accent violet|blue|orange|green|red");
  });

  it("opens a project by id, repo name or name prefix", () => {
    expect(run("open authkit", ctx).effects).toEqual([{ type: "open", id: "authkit" }]);
    expect(run("cd dsa-exercises-website", ctx).effects).toEqual([{ type: "open", id: "dsa" }]);
    expect(run("open Rend", ctx).effects).toEqual([{ type: "open", id: "renderex" }]);
  });

  it("reports unknown projects without side effects", () => {
    const r = run("open nope", ctx);
    expect(r.effects).toEqual([]);
    expect(text(r.lines)).toContain("open: no such project: nope");
  });

  it("validates accent and prompt arguments", () => {
    expect(run("accent orange", ctx).effects).toEqual([{ type: "accent", value: "orange" }]);
    expect(text(run("accent pink", ctx).lines)).toContain("usage: accent");
    expect(run("prompt λ", ctx).effects).toEqual([{ type: "prompt", value: "lambda" }]);
  });

  it("toggles the theme when no argument is given", () => {
    expect(run("theme", ctx).effects).toEqual([{ type: "theme", value: "light" }]);
    expect(run("theme dark", { ...ctx, theme: "light" }).effects).toEqual([{ type: "theme", value: "dark" }]);
  });

  it("clears, prints neofetch and handles unknown input", () => {
    expect(run("clear", ctx).clear).toBe(true);
    expect(run("neofetch", ctx).lines).toContainEqual({ k: "neo" });
    expect(text(run("foo", ctx).lines)).toContain("zsh: command not found: foo");
  });

  it("only opens the mail client for sudo hire-me", () => {
    expect(run("sudo hire-me", ctx).effects).toEqual([{ type: "mail" }]);
    expect(run("sudo rm -rf", ctx).effects).toEqual([]);
  });

  it("includes the current command in history", () => {
    expect(text(run("history", { ...ctx, history: ["whoami"] }).lines)).toMatch(/1 {2}whoami[\s\S]*2 {2}history/);
  });
});

describe("tab completion", () => {
  it("completes unique commands and arguments", () => {
    expect(complete("neo")).toEqual({ input: "neofetch " });
    expect(complete("accent or")).toEqual({ input: "accent orange" });
    expect(complete("open auth")).toEqual({ input: "open authkit" });
    expect(complete("kubectl g")).toEqual({ input: "kubectl get pods" });
  });

  it("lists ambiguous matches", () => {
    expect(complete("t").list).toEqual(["test", "thesis", "theme"]);
  });
});
