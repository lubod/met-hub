import { test, expect } from "@playwright/test";

test("GET /health returns ok", async ({ request }) => {
  const res = await request.get("/health");
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.status).toBe("ok");
});

test("home page loads without JS errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  // No uncaught JS errors on page load
  expect(errors).toHaveLength(0);
});
