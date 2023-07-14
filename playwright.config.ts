import { chromium, defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require("dotenv").config({ path: "./config/.env" });

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true /* Run tests in parallel */,
  forbidOnly: !!process.env.CI /* Fail the build on CI if you accidentally left test.only in the source code. */,
  retries: process.env.CI ? 1 : 0 /* Retry on CI only */,
  reporter: [/*["html"],*/ ["line"]] /* Reporter to use. See https://playwright.dev/docs/test-reporters */,

  /* Shared settings for all the projects below. */
  use: {
    trace:
      "on-first-retry" /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */,
  },

  projects: [
    // {
    //   name: "setup",
    //   testDir: "./config/",
    //   testMatch: "global-setup.ts"
    // },

    {
      name: "chromium",
      // dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: "./config/auth.json" },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
