import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { closeNavigation, openNavigation } from "./navigation";

for (const width of [390, 768, 1440, 1920]) {
  test(`hero destinations and profile views at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto("/");
    const hero = page.locator("#profile");
    const socials = hero.getByRole("navigation", {
      name: "Social and contact links",
    });
    await expect(socials.getByRole("link")).toHaveText([
      "Email",
      "GitHub",
      "Twitter",
      "LinkedIn",
      "Résumé",
    ]);
    const connectLabels = [
      "Email",
      "GitHub",
      "X (Twitter)",
      "LinkedIn",
      "Resume",
    ];
    for (const [index, link] of (
      await socials.getByRole("link").all()
    ).entries()) {
      const shared = page
        .locator("#connect")
        .getByRole("link", { name: connectLabels[index], exact: true });
      await expect(link).toHaveAttribute(
        "href",
        (await shared.getAttribute("href"))!,
      );
      if (index === 0) {
        await expect(link).not.toHaveAttribute("target", "_blank");
      } else {
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noreferrer noopener");
      }
    }
    await expect(
      hero.getByRole("link", { name: "View Projects", exact: true }),
    ).toHaveAttribute("href", "#projects");
    await expect(
      hero.getByRole("link", { name: "About Me", exact: true }),
    ).toHaveAttribute("href", "#about");
    await expect(
      hero.getByRole("link", { name: "Scroll to explore", exact: true }),
    ).toHaveAttribute("href", "#about");
    if (width >= 768) {
      await expect(page.locator(".header-profile-views")).toHaveText(
        "124KProfile Views",
      );
      await expect(page.locator(".header-profile-views")).toBeVisible();
    } else {
      await expect(page.locator(".header-profile-views")).toBeHidden();
      await openNavigation(page);
      await expect(page.locator(".menu-profile-views")).toHaveText(
        "124KProfile Views",
      );
      await expect(page.locator(".menu-profile-views")).toBeVisible();
      await closeNavigation(page);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
}

for (const [label, hash] of [
  ["View Projects", "#projects"],
  ["About Me", "#about"],
  ["Scroll to explore", "#about"],
]) {
  test(`${label} scrolls to and focuses its section`, async ({ page }) => {
    await page.goto("/");
    await page
      .locator("#profile")
      .getByRole("link", { name: label, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${hash}$`));
    await expect(page.locator(hash)).toBeFocused();
    await expect
      .poll(() =>
        page
          .locator(hash)
          .evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      )
      .toBe(104);
  });
}

test("desktop menu traps focus, locks scrolling, restores focus, and passes axe", async ({
  page,
}) => {
  await page.goto("/");
  const navigation = await openNavigation(page);
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(dialog).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close navigation menu" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("main")).toHaveJSProperty("inert", true);
  await expect(navigation.getByRole("link").first()).toBeFocused();
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
  const before = await page.evaluate(() => scrollY);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(150);
  expect(await page.evaluate(() => scrollY)).toBe(before);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    audit.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await closeNavigation(page);
  await expect(
    page.getByRole("button", { name: "Open navigation menu" }),
  ).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Open navigation menu" }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("main")).toHaveJSProperty("inert", false);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("keyboard menu and motion controls preserve the current section position", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  const top = () =>
    page.locator("#projects").evaluate((el) => el.getBoundingClientRect().top);
  const before = await top();
  const open = page.getByRole("button", {
    name: "Open navigation menu",
    exact: true,
  });
  await open.evaluate((el) =>
    (el as HTMLButtonElement).focus({ preventScroll: true }),
  );
  await page.keyboard.press("Space");
  await expect(
    page.getByRole("dialog", { name: "Navigation menu" }),
  ).toBeVisible();
  await expect.poll(top).toBeCloseTo(before, 0);
  await page
    .getByRole("button", { name: "Pause animations", exact: true })
    .focus();
  await page.keyboard.press("Space");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await expect.poll(top).toBeCloseTo(before, 0);
  await closeNavigation(page);
  await expect.poll(top).toBeCloseTo(before, 0);
  await expect(open).toBeFocused();
});

for (const scale of [1, 1.25]) {
  test(`diagonal stays straight across the header at ${scale * 100}% scaling`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: {
        width: Math.round(1672 / scale),
        height: Math.round(941 / scale),
      },
      deviceScaleFactor: scale,
    });
    const page = await context.newPage();
    await page.goto("/");
    const header = await page.locator("header").boundingBox();
    expect(header!.height).toBe(76);
    const capture = await page.screenshot();
    const samples = await page.evaluate(
      async ({ png, headerHeight, scale }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${png}`;
        await image.decode();
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(image, 0, 0);
        return [
          16,
          headerHeight - 12,
          headerHeight - 1,
          headerHeight,
          headerHeight + 12,
          headerHeight + 48,
        ].map((y) => {
          const row = Math.round(y * scale);
          const pixels = ctx.getImageData(0, row, canvas.width, 1).data;
          let sum = 0;
          let weightedX = 0;
          for (
            let x = Math.floor(canvas.width * 0.6);
            x < canvas.width * 0.72;
            x++
          ) {
            const weight = Math.max(0, pixels[x * 4] - 100);
            sum += weight;
            weightedX += x * weight;
          }
          return { x: weightedX / sum / scale, y: row / scale, sum };
        });
      },
      { png: capture.toString("base64"), headerHeight: header!.height, scale },
    );
    const first = samples[0];
    const last = samples.at(-1)!;
    const slope = (last.x - first.x) / (last.y - first.y);
    for (const sample of samples) {
      expect(sample.sum).toBeGreaterThan(0);
      expect(
        Math.abs(sample.x - (first.x + slope * (sample.y - first.y))),
      ).toBeLessThan(1);
    }
    await context.close();
  });
}

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 1672, height: 941 },
]) {
  test(`About enters before the desktop hero disappears at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const icons = page.locator(".hero-social-icon");
    await expect(icons).toHaveCount(5);
    for (const icon of await icons.all()) {
      await expect(icon).toBeVisible();
      expect((await icon.boundingBox())!.width).toBe(19);
    }
    const travel = await page
      .locator(".hero-journey")
      .evaluate(
        (el) => el.getBoundingClientRect().bottom + scrollY - innerHeight,
      );
    await page.evaluate(
      (y) => window.scrollTo({ top: y * 0.83, behavior: "instant" }),
      travel,
    );
    await expect(page.locator(".hero-content")).toHaveJSProperty("inert", true);
    await expect
      .poll(async () => {
        const title = (await page.locator("#about-title").boundingBox())!;
        return title.y + title.height;
      })
      .toBeLessThan(viewport.height * 0.8);
    await page.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      travel,
    );
    await expect(page.locator(".hero-backdrop")).toHaveCSS("opacity", "0");
    await expect
      .poll(async () => (await page.locator(".about-copy").boundingBox())!.y)
      .toBeLessThan(viewport.height * 0.9);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(page.locator(".hero-content")).toHaveJSProperty(
      "inert",
      false,
    );
    await expect(page.locator(".hero-content")).toHaveCSS("opacity", "1");
  });
}
