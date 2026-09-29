import { expect, test } from "@playwright/test";

test("wordmark responds to the pointer and stops when paused", async ({
  page,
}) => {
  await page.goto("/");
  const wordmark = page.locator(".vector-wordmark");
  await expect(wordmark).toHaveAttribute("data-ready", "true");
  await expect(wordmark).toHaveAttribute("data-lines", "1");
  const label = wordmark.locator(".wordmark-coordinate").first();
  await page.mouse.move(400, 350);
  const before = await label.textContent();
  await page.mouse.move(1050, 400, { steps: 10 });
  await expect.poll(() => label.textContent()).not.toBe(before);
  await page
    .getByRole("button", { name: "Pause animations", exact: true })
    .click();
  await expect(wordmark).toHaveAttribute("data-running", "false");
  await expect(wordmark.locator(".wordmark-fallback")).toBeVisible();
  const paused = await label.getAttribute("style");
  await page.mouse.move(500, 350);
  await page.waitForTimeout(200);
  expect(await label.getAttribute("style")).toBe(paused);
  await page
    .getByRole("button", { name: "Resume animations", exact: true })
    .click();
  await expect(wordmark).toHaveAttribute("data-running", "true");
});

test("scroll fades and reverses the hero, then visits sections in the requested order", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    await page
      .locator("main > section")
      .evaluateAll((nodes) => nodes.map((n) => n.id)),
  ).toEqual([
    "profile",
    "about",
    "connect",
    "projects",
    "stack",
    "github",
    "contact",
  ]);
  const hero = page.locator(".hero-content");
  const travel = await page
    .locator(".hero-journey")
    .evaluate(
      (el) => el.getBoundingClientRect().bottom + scrollY - innerHeight,
    );
  await page.evaluate(
    (y) => window.scrollTo({ top: y * 0.55, behavior: "instant" }),
    travel,
  );
  await expect
    .poll(async () =>
      Number(await hero.evaluate((el) => getComputedStyle(el).opacity)),
    )
    .toBeLessThan(0.8);
  await expect
    .poll(async () =>
      Number(await hero.evaluate((el) => getComputedStyle(el).opacity)),
    )
    .toBeGreaterThan(0.1);
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    travel,
  );
  await expect(hero).toHaveJSProperty("inert", true);
  await expect(page.locator(".vector-wordmark")).toHaveAttribute(
    "data-running",
    "false",
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(hero).toHaveCSS("opacity", "1");
  await expect(hero).toHaveJSProperty("inert", false);
  await expect(page.locator(".vector-wordmark")).toHaveAttribute(
    "data-running",
    "true",
  );
});

test("mobile uses one canvas with two lines and fits at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const mark = page.locator(".vector-wordmark");
  await expect(mark).toHaveAttribute("data-lines", "2");
  await expect(mark.locator("canvas")).toHaveCount(1);
  await page.setViewportSize({ width: 320, height: 700 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(mark.locator(".wordmark-mobile")).toBeVisible();
  const box = await mark.locator(".wordmark-mobile").boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  const hero = page.locator(".hero-journey");
  await expect(hero).toHaveAttribute("data-animated", "false");
});

test("name survives unavailable WebGL and context loss", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      ...args: Parameters<typeof original>
    ) {
      if (String(args[0]).startsWith("webgl")) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto("/");
  await expect(page.locator(".wordmark-fallback")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Pulkit Sharma",
  );
});

test("a lost GPU context shows the static name", async ({ page }) => {
  await page.goto("/");
  const mark = page.locator(".vector-wordmark");
  await expect(mark).toHaveAttribute("data-ready", "true");
  await mark.locator("canvas").evaluate((el) => {
    const gl = (el as HTMLCanvasElement).getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  });
  await expect(mark).toHaveAttribute("data-ready", "false");
  await expect(mark.locator(".wordmark-fallback")).toBeVisible();
});

test("changing motion preferences preserves downstream position", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  const top = () =>
    page.locator("#projects").evaluate((el) => el.getBoundingClientRect().top);
  const before = await top();
  const toggle = await page.locator(".motion-toggle").boundingBox();
  await page.mouse.click(toggle!.x + 22, toggle!.y + 22);
  await expect.poll(top).toBeCloseTo(before, 0);
  await page.mouse.click(toggle!.x + 22, toggle!.y + 22);
  await expect.poll(top).toBeCloseTo(before, 0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(top).toBeCloseTo(before, 0);
});

test("anchors land below the header, history works, and the mobile menu locks wheel scrolling", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect
    .poll(() =>
      page
        .locator("#about")
        .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBe(108);
  await page
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect
    .poll(() =>
      page
        .locator("#projects")
        .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBe(108);
  await page.goBack();
  await expect(page).toHaveURL(/#about$/);
  await expect
    .poll(() =>
      page
        .locator("#about")
        .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBe(108);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 700);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await expect
    .poll(() =>
      page
        .locator("#projects")
        .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
    )
    .toBe(96);
});
