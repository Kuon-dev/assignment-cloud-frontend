import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/login");
  await page.getByRole("button", { name: "Save Preferences" }).click();
  await page.getByPlaceholder("name@example.com").click();
  await page.getByPlaceholder("name@example.com").fill("test3@mail.com");
  await page.getByPlaceholder("********").click();
  await page.getByPlaceholder("********").fill("tester@3");
  await page.getByPlaceholder("********").press("Enter");
  await page.getByPlaceholder("********").click();
  await page.getByPlaceholder("********").fill("Tester@mail.com");
  await page.getByPlaceholder("********").press("Enter");
  await page.getByPlaceholder("********").click();
  await page.getByPlaceholder("********").fill("Tester@3");
  await page.getByPlaceholder("********").press("Enter");
  await page.goto("http://localhost:5173/dashboard");
  await page.getByRole("link", { name: "Acme Inc" }).click();
  await expect(page.getByRole("link", { name: "Acme Inc" })).toBeVisible();
});
