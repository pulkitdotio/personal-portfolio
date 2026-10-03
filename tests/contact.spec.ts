import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#contact");
});

test("contact form requires every field and rejects invalid email and blank text", async ({
  page,
  context,
}) => {
  const client = await context.newCDPSession(page);
  await client.send("Page.enable");
  const drafts: string[] = [];
  client.on("Page.frameRequestedNavigation", ({ url }) => {
    if (url.startsWith("mailto:")) drafts.push(url);
  });
  const send = page.getByRole("button", { name: "Send message" });
  const name = page.getByLabel("NAME", { exact: true });
  const email = page.getByLabel("EMAIL", { exact: true });
  const subject = page.getByLabel("SUBJECT", { exact: true });
  const message = page.getByLabel("MESSAGE", { exact: true });

  await send.click();
  await expect(name).toBeFocused();
  await name.fill("Avery");
  await send.click();
  await expect(email).toBeFocused();
  await email.fill("not-an-email");
  await send.click();
  await expect(email).toBeFocused();
  expect(
    await email.evaluate(
      (input: HTMLInputElement) => input.validity.typeMismatch,
    ),
  ).toBe(true);
  await email.fill("avery@example.com");
  await send.click();
  await expect(subject).toBeFocused();
  await subject.fill("Portfolio project");
  await send.click();
  await expect(message).toBeFocused();
  await message.fill("   ");
  await send.click();
  await expect(message).toBeFocused();
  expect(
    await message.evaluate(
      (input: HTMLTextAreaElement) => input.validity.customError,
    ),
  ).toBe(true);
  await message.fill("A project to discuss.");
  expect(
    await message.evaluate((input: HTMLTextAreaElement) =>
      input.checkValidity(),
    ),
  ).toBe(true);
  await name.fill("   ");
  await send.click();
  await expect(name).toBeFocused();
  await name.fill("Avery");
  await subject.fill("   ");
  await send.click();
  await expect(subject).toBeFocused();
  expect(drafts).toEqual([]);
  await expect(page.locator(".contact-form-feedback")).toBeEmpty();
});

test("send message opens an encoded email draft with all form values", async ({
  page,
  context,
}) => {
  const name = "Avery & 李";
  const email = "avery+portfolio@example.com";
  const subject = "Project: R&D + café #1?";
  const message =
    "Let's build together.\nDetails: a=1 & b=2\n&bcc=someone@example.com";
  await page.getByLabel("NAME", { exact: true }).fill(` ${name} `);
  await page.getByLabel("EMAIL", { exact: true }).fill(email);
  await page.getByLabel("SUBJECT", { exact: true }).fill(` ${subject} `);
  await page.getByLabel("MESSAGE", { exact: true }).fill(` ${message} `);

  const client = await context.newCDPSession(page);
  await client.send("Page.enable");
  const navigation = new Promise<string>((resolve) => {
    client.on("Page.frameRequestedNavigation", ({ url }) => {
      if (url.startsWith("mailto:")) resolve(url);
    });
  });
  await page.getByRole("button", { name: "Send message" }).click();
  const draft = new URL(await navigation);
  expect(draft.protocol).toBe("mailto:");
  expect(draft.pathname).toBe("pulkit1865@gmail.com");
  expect([...draft.searchParams.keys()]).toEqual(["subject", "body"]);
  expect(draft.searchParams.get("subject")).toBe(subject);
  expect(draft.searchParams.get("body")).toBe(
    `Hi Pulkit,\n\n${message}\n\nFrom:\n${name}\n${email}`,
  );
  await expect(page.locator(".contact-form-feedback")).toHaveText(
    "Send your draft from your email app.",
  );
  await expect(page.getByLabel("MESSAGE", { exact: true })).toHaveValue(
    ` ${message} `,
  );
});
