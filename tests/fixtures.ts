import { test as base } from "@playwright/test";

/**
 * Extended test fixture that automatically sets cookie consent
 * before each test to prevent cookie banner from appearing
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Set cookie consent in localStorage before navigating to any page
    await page.addInitScript(() => {
      localStorage.setItem("cookieConsent", JSON.stringify(true));
      localStorage.setItem(
        "cookiePreferences",
        JSON.stringify({
          essential: true,
          analytics: true,
          marketing: false,
          functional: true,
        })
      );
    });

    await use(page);
  },
});

export { expect } from "@playwright/test";
