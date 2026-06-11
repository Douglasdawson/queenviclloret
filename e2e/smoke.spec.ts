import { test, expect } from "@playwright/test";

test("home renders server-side with locale", async ({ page }) => {
  const res = await page.goto("/en");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("root redirects to a locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|es|ca|fr|nl)/);
});

test("robots.txt allows indexing", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.status()).toBe(200);
  expect(await res.text()).toContain("Allow: /");
});

test("api health responds", async ({ request }) => {
  const res = await request.get("/api/health");
  expect(res.ok()).toBeTruthy();
});
