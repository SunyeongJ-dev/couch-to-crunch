import { test, expect } from "@playwright/test";

test("no search results", async ({ page }) => {
  // Use a random string to get no results.
  await page.goto("/search?q=abcdefg123");
  await expect(page.getByText("No results found.")).toBeVisible();
});

test("search for a video", async ({ page }) => {
  // Use a search term that will return results.
  await page.goto("/search?q=legs");
  await expect(
    page.getByRole("link").getByRole("heading", { level: 3 }).first(),
  ).toBeVisible();
});
