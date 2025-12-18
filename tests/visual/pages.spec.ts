import { test, expect } from "../fixtures";

// Test only critical full-page views
// @visual - Skip in CI due to platform-specific snapshots
test.describe("Key Page Snapshots", () => {
  test("homepage renders correctly", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot("homepage.png", {
      fullPage: true,
    });
  });

  test("blog page renders correctly", async ({ page }) => {
    await page.goto("/blog/");
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot("blog.png", {
      fullPage: true,
    });
  });
});
