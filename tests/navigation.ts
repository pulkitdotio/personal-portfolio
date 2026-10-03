import { expect, type Page } from "@playwright/test";

export async function openNavigation(page: Page) {
  const navigation = page.getByRole("navigation", {
    name: "Primary navigation",
  });
  if (!(await navigation.isVisible())) {
    const button = page.getByRole("button", {
      name: "Open navigation menu",
      exact: true,
    });
    await expect(button).toBeVisible();
    // A real pointer click avoids Chromium scrolling a nested sticky header
    // when locator.click() first invokes scrollIntoViewIfNeeded().
    const box = (await button.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  }
  await expect(navigation).toBeVisible();
  return navigation;
}

export async function closeNavigation(page: Page) {
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Navigation menu" }),
  ).toHaveCount(0);
  await expect(page.locator(".navigation-menu-shell")).toHaveCount(0);
}

export async function toggleAnimations(page: Page, action: "Pause" | "Resume") {
  await openNavigation(page);
  await page
    .getByRole("button", { name: `${action} animations`, exact: true })
    .click();
  await closeNavigation(page);
}
