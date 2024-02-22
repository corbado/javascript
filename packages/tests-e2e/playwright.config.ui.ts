import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Using all cores increases flakiness due to slow browsers.
  // Recommended # of workers = # of cores / 2, but leaving only 1 free
  // core seems enough to prevent flakiness on our self-hosted runners.
  // Ref: https://learn.microsoft.com/en-us/azure/playwright-testing/concept-determine-optimal-configuration#run-tests-locally
  workers: process.env.CI
    ? process.env.PLAYWRIGHT_NUM_CORES
      ? parseInt(process.env.PLAYWRIGHT_NUM_CORES, 10) - 1
      : undefined
    : undefined,
  reporter: 'html',
  timeout: 15000, // default: 30000ms
  expect: {
    timeout: 3000, // default: 5000ms
  },
  use: {
    actionTimeout: 3000, // default: none
    navigationTimeout: 3000, // default: none
    baseURL: process.env.PLAYWRIGHT_TEST_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    //////////////////////////////////////////////////////
    // B1.1 configs: SignUp with Identifier (unverified)
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | false
    //  Phone    | false   | false
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b1-1-setup',
      testMatch: ['ui/b1-1/setup.ts'],
    },
    {
      name: 'b1-1-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-1/all-browsers/*.*', 'ui/b1-1/chromium/*.*'],
      dependencies: ['b1-1-setup'],
    },
    // {
    //   name: 'b1-1-firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   testMatch: ['ui/b1-1/all-browsers/*.*'],
    //   dependencies: ['b1-1-setup'],
    // },
    // {
    //   name: 'b1-1-webkit',
    //   use: { ...devices['Desktop Safari'] },
    //   testMatch: ['ui/b1-1/all-browsers/*.*'],
    //   dependencies: ['b1-1-setup'],
    // },
    // {
    //   name: 'b1-1-mobile-chrome',
    //   use: { ...devices['Pixel 7'] },
    //   testMatch: ['ui/b1-1/all-browsers/*.*', 'ui/b1-1/chromium/*.*'],
    //   dependencies: ['b1-1-setup'],
    // },
    // {
    //   name: 'b1-1-mobile-safari',
    //   use: { ...devices['iPhone 14 Pro Max'] },
    //   testMatch: ['ui/b1-1/all-browsers/*.*'],
    //   dependencies: ['b1-1-setup'],
    // },
    // {
    //   name: 'b1-1-msedge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    //   testMatch: ['ui/b1-1/all-browsers/*.*', 'ui/b1-1/chromium/*.*'],
    //   dependencies: ['b1-1-setup'],
    // },
    // {
    //   name: 'b1-1-all-browsers',
    //   testMatch: ['ui/b1-1/teardown.ts'],
    //   dependencies: ['b1-1-chromium', 'b1-1-firefox', 'b1-1-webkit', 'b1-1-mobile-chrome', 'b1-1-mobile-safari', 'b1-1-msedge'],
    // },
    //////////////////////////////////////////////////////
    // B1.2 configs: SignUp with Identifier (verified)
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | false   | false
    //  Phone    | true    | true
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b1-2-setup',
      testMatch: ['ui/b1-2/setup.ts'],
      // dependencies: ['b1-1-chromium'],
    },
    {
      name: 'b1-2-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-2/all-browsers/*.*', 'ui/b1-2/chromium/*.*'],
      dependencies: ['b1-2-setup'],
    },
    //////////////////////////////////////////////////////
    // B1.3 configs: SignUp with Identifiers (verified)
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | true
    //  Phone    | true    | true
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b1-3-setup',
      testMatch: ['ui/b1-3/setup.ts'],
      // dependencies: ['b1-2-chromium'],
    },
    {
      name: 'b1-3-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-3/all-browsers/*.*', 'ui/b1-3/chromium/*.*'],
      dependencies: ['b1-3-setup'],
    },
  ],
});
