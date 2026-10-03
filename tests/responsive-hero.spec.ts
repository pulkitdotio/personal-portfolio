import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  closeNavigation,
  openNavigation,
  toggleAnimations,
} from "./navigation";

const viewports = [
  { width: 320, height: 700 },
  { width: 360, height: 800 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
];

for (const viewport of viewports) {
  test(`responsive hero composition and navigation at ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    const phone = viewport.width < 700;
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const mark = page.locator(".vector-wordmark");
    await expect(mark).toHaveAttribute("data-ready", "true");
    await expect(mark).toHaveAttribute("data-lines", phone ? "2" : "1");
    const profile = page.locator("#profile");
    await expect(profile).toHaveAttribute("data-animated", "false");
    await expect(page.locator(".hero-stage")).toHaveCSS("position", "relative");
    expect((await page.locator("header").boundingBox())!.height).toBe(
      phone ? 64 : 68,
    );
    const dimensions = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(dimensions.scroll).toBe(dimensions.client);
    // Check geometry even with the existing global clipping removed.
    await page.addStyleTag({
      content: "#root { overflow: visible !important }",
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(dimensions.client);
    await expect(page.locator(".hero-architecture")).toBeHidden();
    await expect(page.locator(".header-geometry")).toBeHidden();
    for (const selector of [
      ".hero-plane",
      ".hero-diagonal",
      ".hero-cross-rule",
    ]) {
      for (const decoration of await page.locator(selector).all()) {
        await expect(decoration).toBeHidden();
      }
    }

    const blocks = [
      ".hero-wordmark",
      ".hero-tagline",
      ".hero-statement",
      ".hero-availability",
      ".hero-text-links",
      ".hero-socials",
      ".hero-scroll",
    ];
    let previousBottom = 0;
    const gutter = await page
      .locator(".hero-content")
      .evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
    for (const selector of blocks) {
      const box = (await page.locator(selector).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(gutter - 1);
      expect(box.x + box.width).toBeLessThanOrEqual(
        viewport.width - gutter + 1,
      );
      if (phone || selector !== ".hero-statement")
        expect(box.y).toBeGreaterThanOrEqual(previousBottom - 1);
      previousBottom = box.y + box.height;
    }
    const markBox = (await mark.boundingBox())!;
    expect(markBox.x + markBox.width / 2).toBeCloseTo(viewport.width / 2, 0);
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

    const socials = page.locator(".hero-socials a");
    await expect(socials).toHaveCount(5);
    const boxes = [];
    for (const link of await socials.all()) {
      const box = (await link.boundingBox())!;
      boxes.push(box);
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      await expect(link.locator(".hero-social-icon")).toBeVisible();
    }
    expect(new Set(boxes.map((box) => Math.round(box.y))).size).toBe(
      phone ? 2 : 1,
    );
    if (phone) {
      expect(boxes[3].width).toBeCloseTo(boxes[0].width, 0);
      expect(boxes[4].x + boxes[4].width - viewport.width / 2).toBeCloseTo(
        viewport.width / 2 - boxes[3].x,
        0,
      );
    }
    await expect(
      page.getByRole("link", { name: "View Projects", exact: true }),
    ).toHaveAttribute("href", "#projects");
    await expect(
      page.getByRole("link", { name: "About Me", exact: true }),
    ).toHaveAttribute("href", "#about");
    await expect(page.locator(".hero-scroll")).toBeVisible();
    const heroBox = (await profile.boundingBox())!;
    const aboutBox = (await page.locator("#about").boundingBox())!;
    expect(aboutBox.y).toBeCloseTo(heroBox.y + heroBox.height, 0);
    expect(aboutBox.x).toBeCloseTo(gutter, 0);
    expect(heroBox.height).toBe(
      (await page.locator(".hero-content").boundingBox())!.height,
    );
    expect(aboutBox.y - previousBottom).toBeLessThan(28);
    const aboutPadding = await page
      .locator("#about")
      .evaluate((el) => parseFloat(getComputedStyle(el).paddingTop));
    expect(aboutPadding).toBeGreaterThanOrEqual(24);
    expect(aboutPadding).toBeLessThanOrEqual(48);

    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      heroBox.y + heroBox.height - viewport.height * 0.6,
    );
    await expect(page.locator(".hero-content")).toHaveCSS("opacity", "1");
    await expect(page.locator(".hero-content")).toHaveJSProperty(
      "inert",
      false,
    );
    expect(
      (await page.locator("header").boundingBox())!.y +
        (await page.locator("header").boundingBox())!.height,
    ).toBeLessThanOrEqual(0);
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

    const position = () =>
      page.locator("#about").evaluate((el) => el.getBoundingClientRect().top);
    const before = await position();
    const menu = await openNavigation(page);
    await expect(menu.getByRole("link").first()).toBeFocused();
    await expect(
      page.getByRole("button", { name: "Close navigation menu", exact: true }),
    ).toBeInViewport();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await closeNavigation(page);
    await expect.poll(position).toBeCloseTo(before, 0);
    await toggleAnimations(page, "Pause");
    await expect.poll(position).toBeCloseTo(before, 0);
    await toggleAnimations(page, "Resume");
    await expect.poll(position).toBeCloseTo(before, 0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(position).toBeCloseTo(before, 0);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(mark.locator(".wordmark-fallback")).toBeVisible();
    const fallback = (await mark
      .locator(phone ? ".wordmark-mobile" : ".wordmark-desktop")
      .boundingBox())!;
    expect(fallback.x).toBeGreaterThanOrEqual(gutter);
    expect(fallback.x + fallback.width).toBeLessThanOrEqual(
      viewport.width - gutter,
    );
    expect(fallback.width / markBox.width).toBeGreaterThan(0.68);
    expect(fallback.width / markBox.width).toBeLessThan(0.83);
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

test("wordmark and CSS use the same mode at the phone/tablet boundary", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [699, 700, 1199, 1200]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.locator(".vector-wordmark")).toHaveAttribute(
      "data-lines",
      width < 700 ? "2" : "1",
    );
    await expect(page.locator("#profile")).toHaveAttribute(
      "data-animated",
      width < 1200 ? "false" : "true",
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }
});

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
  await expect(mark).toHaveAttribute("data-ready", "true");
  const pointer = () =>
    mark.locator("canvas").evaluate((el) => {
      const gl = (el as HTMLCanvasElement).getContext("webgl")!;
      const program = gl.getParameter(gl.CURRENT_PROGRAM) as WebGLProgram;
      const value = gl.getUniform(
        program,
        gl.getUniformLocation(program, "uPtr"),
      );
      return { x: Number(value[0]), y: Number(value[1]) };
    });
  const box = (await mark.boundingBox())!;
  const client = await context.newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: box.x + box.width * 0.8, y: box.y + box.height * 0.7 }],
  });
  // Read the live shader input: WebGL's default drawing buffer need not retain
  // pixels between frames, so toDataURL cannot reliably verify touch response.
  await expect.poll(pointer).toEqual({
    x: expect.closeTo(0.8, 1),
    y: expect.closeTo(0.3, 1),
  });
  await client.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
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
