import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OutputLine } from "@/components/terminal/output";
import { O } from "@/components/terminal/commands";

describe("terminal output", () => {
  it("renders the arrow prompt with the command", () => {
    render(<OutputLine line={{ k: "cmd", t: "whoami" }} prompt="arrow" streak={1} />);
    expect(screen.getByText("umejr")).toBeInTheDocument();
    expect(screen.getByText("⎇ main")).toBeInTheDocument();
    expect(screen.getByText("whoami")).toBeInTheDocument();
  });

  it("colours segments by tone", () => {
    render(<OutputLine line={O(["ok", "a"], " plain")} prompt="pure" streak={1} />);
    expect(screen.getByText("ok")).toHaveClass("text-acc");
  });

  it("shows the live streak in neofetch", () => {
    render(<OutputLine line={{ k: "neo" }} prompt="lambda" streak={42} />);
    expect(screen.getByText(/42 days/)).toBeInTheDocument();
  });
});
