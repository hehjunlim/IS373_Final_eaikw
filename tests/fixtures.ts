import { test as base } from "@playwright/test";

/**
 * Extended test fixture that automatically sets cookie consent
 * before each test to prevent cookie banner from appearing
 */
export const test = base.extend({
  context: async ({ context }, use) => {
    // Set cookie consent before any tests run
    await context.addCookies([
      {
        name: "cookie-consent",
        value: "accepted",
        domain: "localhost",
        path: "/",
      },
    ]);

    await use(context);
  },
});

export { expect } from "@playwright/test";
