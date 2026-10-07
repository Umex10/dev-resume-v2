import { test as base, expect, type Page } from "@playwright/test";

/** Skips the opener (already seen this session) unless a test opts out. */
export const test = base.extend<{ skipIntro: boolean }>({
  skipIntro: [true, { option: true }],
  page: async ({ page, skipIntro }, provide) => {
    if (skipIntro) await page.addInitScript(() => sessionStorage.setItem("umex-intro", "1"));
    await provide(page);
  },
});

export { expect };

/** Navigates and waits until React has hydrated (handlers are attached). */
export async function goto(page: Page, url: string) {
  await page.goto(url);
  await page.locator("html[data-hydrated]").waitFor({ state: "attached" });
}

export async function gotoSection(page: Page, id: string) {
  await goto(page, "/");
  await page.evaluate((id) => document.getElementById(id)!.scrollIntoView({ behavior: "instant" }), id);
}

/** True when the element's box is fully inside the viewport. */
export async function fullyInViewport(page: Page, selector: string) {
  return page.locator(selector).evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= window.innerHeight + 1;
  });
}
