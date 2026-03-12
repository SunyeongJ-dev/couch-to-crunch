import { test, expect } from "@playwright/test";

test("sort by most viewed", async ({ page }) => {
  await page.goto("/");

  // Expect some video cards to be visible before applying sort.
  const videoCards = page.getByRole("link").getByRole("heading", { level: 3 });
  await expect(videoCards.first()).toBeVisible();
  // Get the first video title before applying the sort.
  const beforeFirstTitle = await videoCards.first().innerText();

  // Expect the "Most Viewed" sort option to be checked after clicking it.
  await page.getByRole("radio", { name: "Most Viewed" }).click();
  await expect(page.getByRole("radio", { name: "Most Viewed" })).toBeChecked();

  // Get the first video title after applying the sort and expect it to be different.
  const afterFirstTitle = await videoCards.first().innerText();
  expect(afterFirstTitle).not.toEqual(beforeFirstTitle);
});

test("apply type filter", async ({ page }) => {
  await page.goto("/");

  // Expect some video cards to be visible before applying filters.
  const videoCards = page.getByRole("link").getByRole("heading", { level: 3 });
  await expect(videoCards.first()).toBeVisible();
  // Count the number of video cards before applying the filter.
  const beforeCount = await videoCards.count();

  // Expect the "Yoga" filter to be checked after clicking it.
  const yogaFilter = page.getByRole("checkbox", { name: "Yoga" });
  await yogaFilter.click();
  await expect(yogaFilter).toBeChecked();

  // Expect fewer video cards to be visible after applying the filter.
  const afterCount = await videoCards.count();
  expect(afterCount).toBeLessThan(beforeCount);
});

test("navigate to watch page", async ({ page }) => {
  await page.goto("/");

  // Click on the first video card.
  const firstVideoCard = page
    .getByRole("link")
    .getByRole("heading", { level: 3 })
    .first();
  await firstVideoCard.click();

  // Expect the URL to contain "/watch".
  await expect(page).toHaveURL(/\/watch/);
});

test("navigate to saved page", async ({ page }) => {
  await page.goto("/");

  // Click on the bookmark icon in the header.
  const bookmarkButton = page
    .getByRole("link")
    .getByRole("img", { name: "Saved Workouts" });
  await bookmarkButton.click();

  // Expect the URL to contain "/saved".
  await expect(page).toHaveURL(/\/saved/);
});

test("navigate to channel page", async ({ page }) => {
  await page.goto("/");

  // Click on the channel name of the first video card.
  const firstChannelLink = page
    .getByRole("link")
    .getByRole("paragraph")
    .locator("span")
    .first();
  await firstChannelLink.click();

  // Expect the URL to contain "/channel".
  await expect(page).toHaveURL(/\/channel/);
});

test("navigate to search page", async ({ page }) => {
  await page.goto("/");

  // Type a search query and press Enter.
  await page.getByRole("button", { name: "Search" }).click();
  const searchInput = page.getByPlaceholder("Search videos...");
  await searchInput.waitFor({ state: "visible" });
  await searchInput.fill("test");
  await searchInput.press("Enter");

  // Expect the URL to contain "/search?q=test".
  await expect(page).toHaveURL(/\/search\?q=test/);
});
