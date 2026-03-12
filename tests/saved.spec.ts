import { test, expect } from "@playwright/test";

test("display empty saved videos", async ({ page }) => {
  await page.goto("/saved");
  await expect(page.getByText("No saved videos yet.")).toBeVisible();
});

test("save video from home page", async ({ page }) => {
  await page.goto("/");
  // Save the first video on the home page.
  await page.getByRole("button", { name: "+" }).first().click();

  // Go to the saved videos page and verify the video is there.
  await page.goto("/saved");
  await expect(page.getByRole("heading", { level: 3 })).toBeVisible();

  // Remove the video from saved videos.
  await page.getByRole("button", { name: "-" }).first().click();

  // Verify the saved videos page is empty again.
  await expect(page.getByText("No saved videos yet.")).toBeVisible();
});

test("save video from watch page", async ({ page }) => {
  await page.goto("/");
  // Go to the watch page.
  await page
    .getByRole("link")
    .getByRole("heading", { level: 3 })
    .first()
    .click();

  // Click Save button on the watch page.
  await page.getByRole("button", { name: "Save" }).click();

  await page.goto("/saved");
  await expect(page.getByRole("heading", { level: 3 })).toBeVisible();

  await page.getByRole("button", { name: "-" }).first().click();
  await expect(page.getByText("No saved videos yet.")).toBeVisible();
});
