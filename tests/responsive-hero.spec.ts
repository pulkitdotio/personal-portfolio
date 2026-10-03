import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";
import {
  closeNavigation,
  openNavigation,
  toggleAnimations,
} from "./navigation";

const viewports = [
  { width: 320, height: 700 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
];

for (const viewport of viewports) {
  test(`stacked hero fits and flows into About at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const mark = page.locator(".vector-wordmark");
    await expect(mark).toHaveAttribute("data-ready", "true");
    await expect(mark).toHaveAttribute(
      "data-lines",
      viewport.width < 768 ? "2" : "1",
    );
    const profile = page.locator("#profile");
    await expect(profile).toHaveAttribute("data-animated", "false");
    await expect(page.locator(".hero-stage")).toHaveCSS("position", "relative");
    expect((await page.locator("header").boundingBox())!.height).toBe(
      viewport.width < 768 ? 60 : 64,
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(viewport.width);

    const sequence = [
      ".hero-wordmark",
      ".hero-tagline",
      ".hero-statement",
      ".hero-availability",
      ".hero-text-links",
      ".hero-socials",
      ".hero-scroll",
    ];
    let previousBottom = 0;
    for (const selector of sequence) {
      const box = (await page.locator(selector).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
      expect(box.y).toBeGreaterThanOrEqual(previousBottom);
      previousBottom = box.y + box.height;
    }
    // Check actual text fragments, rather than just their containing blocks.
    const clipped = await page
      .locator(
        ".hero-tagline, .hero-statement, .hero-text-links a, .hero-social-label",
      )
      .evaluateAll((elements) =>
        elements.flatMap((element) => {
          const bounds = element.getBoundingClientRect();
          const range = document.createRange();
          range.selectNodeContents(element);
          return Array.from(range.getClientRects())
            .filter(
              (rect) =>
                rect.left < bounds.left - 1 || rect.right > bounds.right + 1,
            )
            .map(() => element.textContent);
        }),
      );
    expect(clipped).toEqual([]);

    const edge = (await page
      .locator(".hero-architecture .hero-diagonal")
      .boundingBox())!;
    for (const selector of [
      ".hero-wordmark",
      ".hero-tagline",
      ".hero-statement",
      ".hero-availability",
      ".hero-text-links",
      ".hero-socials",
    ]) {
      const box = (await page.locator(selector).boundingBox())!;
      if (edge.y < box.y + box.height && edge.y + edge.height > box.y)
        expect(edge.x).toBeGreaterThan(box.x + box.width);
    }
    const socials = page.locator(".hero-socials a");
    const rows = new Set<number>();
    for (const link of await socials.all()) {
      const box = (await link.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      await expect(link.locator(".hero-social-icon")).toBeVisible();
      rows.add(Math.round(box.y));
    }
    expect(rows.size).toBe(viewport.width < 360 ? 3 : 2);
    const heroBox = (await profile.boundingBox())!;
    const aboutBox = (await page.locator("#about").boundingBox())!;
    expect(aboutBox.y).toBeCloseTo(heroBox.y + heroBox.height, 0);
    expect(heroBox.height).toBe(
      (await page.locator(".hero-content").boundingBox())!.height,
    );
    expect(aboutBox.y - previousBottom).toBeLessThan(24);

    if (viewport.width === 390 || viewport.width === 768) {
      await mkdir(".cache/screenshots/responsive", { recursive: true });
      await page.mouse.move(viewport.width - 1, 0);
      await page.screenshot({
        path: `.cache/screenshots/responsive/hero-${viewport.width}x${viewport.height}.png`,
      });
    }
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      heroBox.y + heroBox.height - viewport.height * 0.6,
    );
    await expect(page.locator(".hero-content")).toHaveCSS("opacity", "1");
    await expect(page.locator(".hero-content")).toHaveJSProperty(
      "inert",
      false,
    );
    await expect
      .poll(async () => {
        const title = (await page.locator("#about-title").boundingBox())!;
        return title.y + title.height;
      })
      .toBeLessThan(viewport.height * 0.85);
    await expect(page.locator("#about-title").locator("..")).toHaveCSS(
      "transform",
      "none",
    );
    if (viewport.width === 390 || viewport.width === 768) {
      await expect(page.locator(".about-identity")).toHaveCSS("opacity", "1");
      await expect(page.locator(".about-copy > div").first()).toHaveCSS(
        "opacity",
        "1",
      );
      await expect(page.locator(".section-rule").first()).toHaveCSS(
        "transform",
        "none",
      );
      await page.screenshot({
        path: `.cache/screenshots/responsive/about-entry-${viewport.width}.png`,
      });
    }

    const position = () =>
      page.locator("#about").evaluate((el) => el.getBoundingClientRect().top);
    const before = await position();
    await toggleAnimations(page, "Pause");
    await expect.poll(position).toBeCloseTo(before, 0);
    await toggleAnimations(page, "Resume");
    await expect.poll(position).toBeCloseTo(before, 0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(position).toBeCloseTo(before, 0);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(mark.locator(".wordmark-fallback")).toBeVisible();
    const fallback = (await mark
      .locator(viewport.width < 768 ? ".wordmark-mobile" : ".wordmark-desktop")
      .boundingBox())!;
    expect(fallback.x).toBeGreaterThanOrEqual(0);
    expect(fallback.x + fallback.width).toBeLessThanOrEqual(viewport.width);
    const audit = await new AxeBuilder({ page })
      .include("header")
      .include("#profile")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      audit.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  });
}

test("phone keyboard order follows the visual hierarchy", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const actions = page.locator(".hero-text-links a");
  await actions.first().focus();
  await page.keyboard.press("Tab");
  await expect(actions.last()).toBeFocused();
  for (const link of await page.locator(".hero-socials a").all()) {
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
  }
  await page.keyboard.press("Tab");
  await expect(page.locator(".hero-scroll")).toBeFocused();
});

test("touch wordmark responds, the narrow menu scrolls, and its actions remain reachable", async ({
  browser,
}) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 320, height: 700 },
  });
  const page = await context.newPage();
  await page.goto("/");
  const mark = page.locator(".vector-wordmark");
  await expect(mark).toHaveAttribute("data-running", "true");
  const label = mark.locator(".wordmark-coordinate").first();
  const before = await label.getAttribute("style");
  const box = (await mark.boundingBox())!;
  await page.touchscreen.tap(box.x + box.width * 0.8, box.y + box.height * 0.7);
  await expect.poll(() => label.getAttribute("style")).not.toBe(before);
  const client = await context.newCDPSession(page);
  // A real native pan verifies the touch rig never captures vertical scrolling.
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 160, y: box.y + box.height * 0.8 }],
  });
  for (const fraction of [0.65, 0.5, 0.35, 0.2]) {
    await client.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 160, y: box.y + box.height * fraction }],
    });
    await page.waitForTimeout(50);
  }
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(50);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page
    .getByRole("button", { name: "Open navigation menu", exact: true })
    .tap();
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(nav).toBeVisible();
  await expect(page.locator(".menu-profile-views")).toBeVisible();
  await expect(nav.getByRole("link").first()).toBeFocused();
  for (const link of await nav.getByRole("link").all()) {
    const target = (await link.boundingBox())!;
    expect(target.height).toBeGreaterThanOrEqual(44);
  }
  const pause = page.getByRole("button", {
    name: "Pause animations",
    exact: true,
  });
  await pause.tap();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await closeNavigation(page);
  await expect(mark.locator(".wordmark-fallback")).toBeVisible();
  await openNavigation(page);
  const audit = await new AxeBuilder({ page })
    .include("header")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await nav.getByRole("link", { name: "About", exact: true }).tap();
  await expect(page).toHaveURL(/#about$/);
  await expect(page.locator("#about")).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await context.close();
});

test("resizing a faded desktop hero restores accessible responsive content", async ({
  page,
}) => {
  await page.goto("/");
  const travel = await page
    .locator("#profile")
    .evaluate(
      (el) => el.getBoundingClientRect().bottom + scrollY - innerHeight,
    );
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    travel,
  );
  await expect(page.locator(".hero-content")).toHaveJSProperty("inert", true);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".hero-content")).toHaveJSProperty("inert", false);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(page.locator(".hero-content")).toHaveCSS("opacity", "1");
  await expect(page.locator(".vector-wordmark")).toHaveAttribute(
    "data-running",
    "true",
  );
  await expect(page.locator(".vector-wordmark")).toHaveAttribute(
    "data-lines",
    "2",
  );
});
