import {
  closeNavigation,
  openNavigation,
  toggleAnimations,
} from "./navigation";
import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const api = "**/github-contributions-api.jogruber.de/**";

async function mockCalendar(page: Page) {
  // Deterministic test-only data. Production always uses the live endpoint.
  const year = new Date().getFullYear();
  const first = Date.UTC(year, 0, 1);
  const days = (Date.UTC(year + 1, 0, 1) - first) / 86400000;
  const contributions = Array.from({ length: days }, (_, index) => ({
    date: new Date(first + index * 86400000).toISOString().slice(0, 10),
    count: 0,
    level: 0,
  }));
  await page.route(api, (route) =>
    route.fulfill({ json: { total: { [year]: 0 }, contributions } }),
  );
}

async function revealPage(page: Page) {
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 0; y < height; y += 550) {
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      y,
    );
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(700);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
}

for (const width of [390, 768, 1440, 1920]) {
  test(
    "responsive layout and accessibility at " + width + "px",
    async ({ page }) => {
      await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
      await mockCalendar(page);
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto("/");
      await revealPage(page);
      await expect(page.locator("h1")).toHaveText("Pulkit Sharma");
      await expect(page.locator(".project-card")).toHaveCount(3);
      await expect(page.locator(".technology-chip")).toHaveCount(26);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      for (const card of await page.locator(".project-card").all()) {
        await expect(card).toBeVisible();
        await expect(card.locator("img")).toHaveJSProperty("complete", true);
      }
      await mkdir(".cache/screenshots", { recursive: true });
      await page.screenshot({
        path: ".cache/screenshots/portfolio-" + width + ".png",
        fullPage: true,
      });
      // Freeze decorative motion for a stable contrast audit.
      await toggleAnimations(page, "Pause");
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        audit.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      expect(errors).toEqual([]);
    },
  );
}

test("editorial copy and actions stay stable; pausing persists", async ({
  page,
}) => {
  await mockCalendar(page);
  await page.goto("/");
  const statement = page.locator(".hero-statement");
  await expect(statement).toHaveText(
    "I build products, scalable backends and AI-powered systems.",
  );
  const actions = page.locator(".hero-text-links");
  const before = await actions.boundingBox();
  await page.waitForTimeout(1000);
  expect((await actions.boundingBox())?.y).toBe(before?.y);
  await toggleAnimations(page, "Pause");
  await expect(page.locator(".vector-wordmark")).toHaveAttribute(
    "data-running",
    "false",
  );
  await expect(page.locator(".wordmark-fallback")).toBeVisible();
  await expect(page.locator(".hero-scroll")).toHaveCSS(
    "animation-name",
    "none",
  );
  await page.reload();
  await openNavigation(page);
  await expect(
    page.getByRole("button", { name: "Resume animations", exact: true }),
  ).toBeVisible();
  await expect(page.locator("video")).toHaveCount(0);
});

test("wordmark stops offscreen and resume on return", async ({ page }) => {
  await mockCalendar(page);
  await page.goto("/");
  await expect(page.locator(".vector-wordmark")).toHaveAttribute(
    "data-running",
    "true",
  );
  await page.locator("#connect").scrollIntoViewIfNeeded();
  await expect(page.locator(".vector-wordmark")).toHaveAttribute(
    "data-running",
    "false",
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.locator(".vector-wordmark")).toHaveAttribute(
    "data-running",
    "true",
  );
});

test("system reduced motion disables recurring effects and wordmark interaction", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await mockCalendar(page);
  const videos: string[] = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) videos.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect(page.locator(".wordmark-fallback")).toBeVisible();
  await expect(page.locator(".hero-scroll")).toHaveCSS(
    "animation-name",
    "none",
  );
  await openNavigation(page);
  await expect(
    page.getByRole("button", {
      name: "Animations disabled by system preference",
    }),
  ).toBeDisabled();
  await expect(page.locator("video")).toHaveCount(0);
  expect(videos).toEqual([]);
});

test("mobile menu traps focus, closes with Escape, and navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockCalendar(page);
  await page.goto("/");
  const open = page.getByRole("button", { name: "Open navigation menu" });
  await open.click();
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(nav.getByRole("link").first()).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Close navigation menu" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: "Pause animations", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close navigation menu" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(open).toBeFocused();
  await expect(nav).toHaveCount(0);
  await open.click();
  await nav.getByRole("link", { name: /About/ }).click();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about")).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("copy email succeeds, reports failure, and contact links remain valid", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await mockCalendar(page);
  await page.goto("/");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.locator("#contact").getByRole("status")).toHaveText(
    "Email copied",
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "pulkit1865@gmail.com",
  );
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new Error("denied");
    };
  });
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.locator("#contact").getByRole("status")).toContainText(
    "Couldn't copy",
  );
  await expect(page.locator(".email-address")).toHaveAttribute(
    "href",
    "mailto:pulkit1865@gmail.com",
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(
    page
      .locator(".hero-socials")
      .getByRole("link", { name: "R\u00e9sum\u00e9", exact: true }),
  ).toHaveAttribute("href", /drive.google.com/);
});

test("unavailable GitHub leaves a useful fallback", async ({ page }) => {
  await page.route(api, (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await page.goto("/");
  await page.locator("#github").scrollIntoViewIfNeeded();
  await expect(
    page.getByText("GitHub activity couldn't be loaded right now."),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Explore GitHub" }),
  ).toHaveAttribute("href", "https://github.com/pulkitdotio");
});

test("project hover responds to a pointer and navigation indicates the current section", async ({
  page,
}) => {
  await mockCalendar(page);
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await openNavigation(page);
  await expect(
    page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Projects" }),
  ).toHaveAttribute("aria-current", "location");
  await closeNavigation(page);
  const stage = page.locator(".project-stage").first();
  await expect(page.locator(".project-wrap").first()).toHaveCSS(
    "transform",
    "none",
  );
  await stage.hover({ position: { x: 80, y: 80 } });
  await expect(
    page.locator(".project-preview-transform").first(),
  ).not.toHaveCSS("transform", "none");
  await expect(page.locator(".project-highlight").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await toggleAnimations(page, "Pause");
  await expect(page.locator(".project-highlight")).toHaveCount(0);
});

test("Connect follows About with six working destinations", async ({
  page,
}) => {
  await mockCalendar(page);
  await page.goto("/");
  const row = page.locator("#connect");
  expect(await row.evaluate((el) => el.previousElementSibling?.id)).toBe(
    "about",
  );
  await expect(row.getByRole("link")).toHaveText([
    "Resume",
    "Contact",
    "GitHub",
    "LinkedIn",
    "X (Twitter)",
    "Email",
  ]);
  const hrefs = await row
    .getByRole("link")
    .evaluateAll((links) => links.map((l) => l.getAttribute("href")));
  expect(hrefs[0]).toContain("drive.google.com");
  expect(hrefs[1]).toBe("#contact");
  expect(hrefs[2]).toBe("https://github.com/pulkitdotio");
  expect(hrefs[3]).toContain("linkedin.com/in/pulkit-sharma");
  expect(hrefs[4]).toBe("https://x.com/pulkitdotdev");
  expect(hrefs[5]).toBe("mailto:pulkit1865@gmail.com");
  await row.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator("#contact h2")).toHaveText("Let's talk.");
  await expect(
    page.locator(".section-number, .project-index, .banner-caption"),
  ).toHaveCount(0);
});

test("wordmark and particles animate, pause, and stop in a hidden tab", async ({
  page,
}) => {
  await mockCalendar(page);
  await page.goto("/");
  const title = page.locator(".vector-wordmark");
  await expect(title).toHaveAttribute("data-running", "true");
  const canvas = page.locator(".particle-background");
  const frame = () =>
    canvas.evaluate((c) => (c as HTMLCanvasElement).toDataURL());
  const before = await frame();
  await page.waitForTimeout(200);
  expect(await frame()).not.toBe(before);
  await page.locator("#connect").scrollIntoViewIfNeeded();
  const box = await canvas.boundingBox();
  expect(box?.y).toBe(0);
  const lower = await frame();
  await page.waitForTimeout(200);
  expect(await frame()).not.toBe(lower);
  await toggleAnimations(page, "Pause");
  await expect(canvas).toHaveAttribute("data-running", "false");
  const paused = await frame();
  await page.waitForTimeout(200);
  expect(await frame()).toBe(paused);
  await toggleAnimations(page, "Resume");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(canvas).toHaveAttribute("data-running", "false");
  const hidden = await frame();
  await page.waitForTimeout(200);
  expect(await frame()).toBe(hidden);
  await expect(page.locator(".vector-wordmark")).toHaveAttribute(
    "data-running",
    "false",
  );
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(canvas).toHaveAttribute("data-running", "true");
});

test("touch input leaves project tilt off and reduced motion freezes particles", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await mockCalendar(page);
  await page.goto("/");
  const canvas = page.locator(".particle-background");
  const before = await canvas.evaluate((c) =>
    (c as HTMLCanvasElement).toDataURL(),
  );
  await page.waitForTimeout(200);
  expect(
    await canvas.evaluate((c) => (c as HTMLCanvasElement).toDataURL()),
  ).toBe(before);
  await page.locator(".project-stage").first().tap();
  await expect(page.locator(".project-preview-transform").first()).toHaveCSS(
    "transform",
    "none",
  );
  await expect(page.locator(".project-highlight")).toHaveCount(0);
  await context.close();
});

test("keyboard focus reveals a Connect link", async ({ page }) => {
  await mockCalendar(page);
  await page.goto("/");
  const resume = page
    .locator("#connect")
    .getByRole("link", { name: "Resume", exact: true });
  await resume.focus();
  await expect(resume).toBeFocused();
  await expect(resume.locator("..")).toHaveCSS("opacity", "1");
  await expect(resume.locator("..")).toHaveCSS("transform", "none");
});
