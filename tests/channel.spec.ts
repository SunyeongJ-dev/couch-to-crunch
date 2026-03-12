import { test, expect } from "@playwright/test";

// Navigate to the channel page from home page before each test in this file.
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link")
    .getByRole("paragraph")
    .locator("span")
    .first()
    .click();
});

test("display channel name and videos", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link").getByRole("heading", { level: 3 }).first(),
  ).toBeVisible();
});

test("sort by most viewed", async ({ page }) => {
  const videoCards = page.getByRole("link").getByRole("heading", { level: 3 });
  await expect(videoCards.first()).toBeVisible();

  // Wait for the initial video cards to load before clicking the sort button.
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Most Viewed" }).click();
  await expect(page).toHaveURL(/sort=most_viewed/);
});
