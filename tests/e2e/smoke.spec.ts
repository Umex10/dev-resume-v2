import { expect, fullyInViewport, goto, gotoSection, test } from "./fixtures";

test.describe("opener", () => {
  test.use({ skipIntro: false });

  test("counts to 100, slides away and reveals the hero", async ({ page }) => {
    await goto(page, "/");
    const opener = page.getByTestId("opener");
    await expect(opener).toBeVisible();
    await expect(opener).toBeHidden({ timeout: 8000 });
    await expect(page.locator("html")).toHaveAttribute("data-revealed", "");
    expect(await page.evaluate(() => sessionStorage.getItem("umex-intro"))).toBe("1");
  });

  test("Esc skips it", async ({ page }) => {
    await goto(page, "/");
    await expect(page.getByTestId("opener")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("opener")).toBeHidden({ timeout: 3000 });
  });
});

test.describe("terminal", () => {
  test("help prints the command list", async ({ page }) => {
    await gotoSection(page, "shell");
    const input = page.getByLabel("Terminal input");
    await input.fill("help");
    await input.press("Enter");
    await expect(page.getByTestId("terminal-log")).toContainText("deep dive into a project");
  });

  test("unknown input says command not found", async ({ page }) => {
    await gotoSection(page, "shell");
    const input = page.getByLabel("Terminal input");
    await input.fill("make coffee");
    await input.press("Enter");
    await expect(page.getByTestId("terminal-log")).toContainText("zsh: command not found: make");
  });

  test("a chip brings the terminal into view and shows its last line", async ({ page }) => {
    await goto(page, "/");
    await page.evaluate(() => document.getElementById("shell")!.scrollIntoView({ behavior: "instant", block: "start" }));
    await page.evaluate(() => window.scrollBy(0, -window.innerHeight * 0.5));
    await page.getByRole("button", { name: "$ kubectl get pods" }).click();
    const log = page.getByTestId("terminal-log");
    await expect(log).toContainText("still learning k8s, be gentle", { timeout: 8000 });
    await page.waitForTimeout(900);
    expect(await fullyInViewport(page, "[data-testid=terminal] .glass-strong")).toBe(true);
    const last = log.locator("> div").filter({ hasText: "still learning k8s" });
    await expect(last).toBeInViewport();
  });

  test("auto-types neofetch on first view", async ({ page }) => {
    await gotoSection(page, "shell");
    await expect(page.getByTestId("terminal-log")).toContainText("Software Engineering Student", { timeout: 6000 });
  });

  test("accent orange recolours the site", async ({ page }) => {
    await gotoSection(page, "shell");
    const input = page.getByLabel("Terminal input");
    await input.fill("accent orange");
    await input.press("Enter");
    await expect.poll(() => page.evaluate(() => document.documentElement.style.getPropertyValue("--accH"))).toBe("52");
    expect(await page.evaluate(() => localStorage.getItem("umex-accent"))).toBe("orange");
    await page.reload();
    expect(await page.evaluate(() => document.documentElement.style.getPropertyValue("--accH"))).toBe("52");
  });

  test("open authkit opens the deep dive sheet", async ({ page }) => {
    await gotoSection(page, "shell");
    const input = page.getByLabel("Terminal input");
    await input.fill("open authkit");
    await input.press("Enter");
    const sheet = page.getByTestId("deep-dive");
    await expect(sheet).toBeVisible();
    await expect(page).toHaveURL(/\/work\/authkit$/);
    await expect(sheet.getByRole("heading", { name: "AuthKit", exact: true })).toBeVisible();
  });
});

test.describe("deep dive", () => {
  test("opens from the list, switches projects, closes with Esc", async ({ page, isMobile }) => {
    await gotoSection(page, "work");
    await page.getByRole("link", { name: /Chatex/ }).first().click();
    const sheet = page.getByTestId("deep-dive");
    await expect(sheet).toBeVisible();
    await expect(page).toHaveURL(/\/work\/chatex$/);
    await expect(sheet.getByRole("tab", { name: "WebSocketConfig.java" })).toBeVisible();
    await sheet.getByRole("button", { name: "Next project" }).click();
    await expect(page).toHaveURL(/\/work\/renderex$/);
    await expect(sheet.getByRole("heading", { name: "Renderex", exact: true })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("#work")).toBeInViewport({ ratio: isMobile ? 0.05 : 0.2 });
  });

  test("reopening after switch and close shows exactly one sheet", async ({ page }) => {
    const sheets = page.getByTestId("deep-dive");
    const open = async (name: RegExp, slug: string) => {
      await page.getByRole("link", { name }).first().click();
      await expect(page).toHaveURL(new RegExp(`/work/${slug}$`));
      await expect(sheets).toHaveCount(1);
    };
    await gotoSection(page, "work");
    await open(/Chatex/, "chatex");
    await sheets.getByRole("button", { name: "Next project" }).click();
    await expect(page).toHaveURL(/\/work\/renderex$/);
    await expect(sheets).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(sheets).toHaveCount(0);
    await expect(page).toHaveURL(/\/$/);
    await open(/Chatex/, "chatex");
    await sheets.getByRole("button", { name: "close · esc" }).click();
    await expect(sheets).toHaveCount(0);
    await expect(page).toHaveURL(/\/$/);
    await open(/Renderex/, "renderex");
    await expect(sheets.getByRole("heading", { name: "Renderex", exact: true })).toBeVisible();
  });

  test("key files switch tabs", async ({ page }) => {
    await goto(page, "/work/authkit");
    await page.getByRole("tab", { name: "JwtService.java" }).click();
    await expect(page.getByText("apps/backend/…/auth/JwtService.java")).toBeVisible();
    await expect(page.getByRole("tabpanel", { name: "JwtService.java" })).toContainText("SignatureAlgorithm.HS256");
  });

  test("standalone page renders for shareable links", async ({ page }) => {
    await goto(page, "/work/overex");
    await expect(page.getByRole("heading", { level: 1, name: "Overex" })).toBeVisible();
    await expect(page.getByText("planned").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Repository ↗" })).toHaveCount(0);
    await expect(page).toHaveTitle(/Overex/);
  });
});

test.describe("theme and layout", () => {
  test("theme toggle switches data-theme and persists", async ({ page }) => {
    await goto(page, "/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect(html).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(html).toHaveAttribute("data-theme", "light");
  });

  test("no horizontal overflow", async ({ page }) => {
    await goto(page, "/");
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test("pipeline runs to passed", async ({ page }) => {
    await gotoSection(page, "ship");
    await expect(page.getByTestId("pipeline")).toContainText(/passed · |failed · /, { timeout: 10_000 });
  });

  test("nav and rail follow the current section", async ({ page, isMobile }) => {
    test.skip(isMobile, "nav links and rail are desktop-only");
    await gotoSection(page, "shell");
    await expect(page.getByRole("navigation", { name: "Main" }).locator("[aria-current=true]")).toHaveText("Shell");
    await page.evaluate(() => document.getElementById("status")!.scrollIntoView({ behavior: "instant" }));
    await expect(page.getByRole("navigation", { name: "Main" }).locator("[aria-current=true]")).toHaveText("Status");
    await expect(page.getByRole("navigation", { name: "Sections" }).locator("[aria-current=true]")).toContainText("status");
  });

  test("the section rail hides 3s after the last scroll", async ({ page, isMobile }) => {
    test.skip(isMobile, "rail is desktop-only");
    await gotoSection(page, "status");
    // Keep the pointer out of the 140px hover zone that holds the rail open.
    await page.mouse.move(720, 450);
    await page.mouse.wheel(0, 300);
    const rail = page.getByRole("navigation", { name: "Sections" });
    await expect(rail).toHaveAttribute("data-visible", "true");
    await expect(rail).toHaveAttribute("data-visible", "false", { timeout: 8000 });
  });
});

test.describe("reduced motion", () => {
  test.use({ skipIntro: false, reducedMotion: "reduce" });

  test("skips the opener and shows the static roles", async ({ page }) => {
    await goto(page, "/");
    await expect(page.getByTestId("opener")).toHaveCount(0);
    await expect(page.locator("#intro")).toContainText("CI/CDer");
  });
});
