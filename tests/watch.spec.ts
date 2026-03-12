import { test, expect } from "@playwright/test";

// Navigate to the watch page from home page before each test in this file.
// Because the watch page is dynamic and requires a video ID.
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link")
    .getByRole("heading", { level: 3 })
    .first()
    .click();
});

test("display video player and title", async ({ page }) => {
  await expect(page.locator("iframe")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("save button toggles", async ({ page }) => {
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("button", { name: "Unsave" })).toBeVisible();

  await page.getByRole("button", { name: "Unsave" }).click();
  await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
});

test("show more toggles", async ({ page }) => {
  await page.getByRole("button", { name: "Show More" }).click();
  await expect(page.getByRole("button", { name: "Show Less" })).toBeVisible();

  await page.getByRole("button", { name: "Show Less" }).click();
  await expect(page.getByRole("button", { name: "Show More" })).toBeVisible();
});

test("navigate to channel page", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator("h1 + span").click();
  await expect(page).toHaveURL(/\/channel/);
});
