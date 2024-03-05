import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

if (!process.env.CI) {
  dotenv.config();
} // CI env vars set in e2e-test.yml

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
  // reporter: 'html',
  reporter: [
    [
      'blob',
      {
        // Saving all blobs to the same directory deletes every other blob in the directory
        // so we temporarily make a directory for each project (ref: run-all-projects.sh)
        outputDir: `playwright-report/${process.env.PLAYWRIGHT_PROJECT_NAME}`,
        fileName: `report-${process.env.PLAYWRIGHT_PROJECT_NAME}.zip`,
      },
    ],
  ],
  timeout: 15000, // default: 30000ms
  expect: {
    timeout: 3000, // default: 5000ms
  },
  use: {
    actionTimeout: 3000, // default: none
    navigationTimeout: 3000, // default: none
    baseURL: `${process.env.PLAYWRIGHT_TEST_URL}/${process.env.PLAYWRIGHT_PROJECT_ID}`,
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
      name: 'b1-01-setup',
      testMatch: ['ui/b1-01/setup.ts'],
    },
    {
      name: 'b1-01-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-01/all-browsers/*.*', 'ui/b1-01/chromium/*.*'],
      dependencies: ['b1-01-setup'],
    },
    //////////////////////////////////////////////////////
    // B1.2 configs: SignUp with Identifier (verified)
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | false   | false
    //  Phone    | true    | true
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b1-02-setup',
      testMatch: ['ui/b1-02/setup.ts'],
    },
    {
      name: 'b1-2-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-02/all-browsers/*.*', 'ui/b1-02/chromium/*.*'],
      dependencies: ['b1-02-setup'],
    },
    //////////////////////////////////////////////////////
    // B1.3 configs: SignUp with Identifiers (verified)
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | true
    //  Phone    | true    | true
    //  Social   | false   |
    //  Username | true    |
    {
      name: 'b1-03-setup',
      testMatch: ['ui/b1-03/setup.ts'],
    },
    {
      name: 'b1-03-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-03/all-browsers/*.*', 'ui/b1-03/chromium/*.*'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: ['ui/b1-03/all-browsers/*.*'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['ui/b1-03/all-browsers/*.*'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-mobile-chrome',
      use: { ...devices['Pixel 7'] },
      testMatch: ['ui/b1-03/all-browsers/*.*', 'ui/b1-03/chromium/*.*'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-mobile-safari',
      use: { ...devices['iPhone 14 Pro Max'] },
      testMatch: ['ui/b1-03/all-browsers/*.*'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-msedge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testMatch: ['ui/b1-03/all-browsers/*.*', 'ui/b1-03/chromium/*.*'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-all-browsers',
      testMatch: ['ui/b1-03/teardown.ts'],
      dependencies: [
        'b1-03-chromium',
        'b1-03-firefox',
        'b1-03-webkit',
        'b1-03-mobile-chrome',
        'b1-03-mobile-safari',
        'b1-03-msedge',
      ],
    },
    //////////////////////////////////////////////////////
    // B1.9 configs: SignUp with Identifiers (verified)
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | true
    //  Phone    | true    | true
    //  Social   | true    |
    //  Username | false   |
    // {
    //   name: 'b1-09-setup',
    //   testMatch: ['ui/b1-09/setup.ts'],
    // },
    // {
    //   name: 'b1-09-chromium',
    //   use: { ...devices['Desktop Chrome'] },
    //   testMatch: ['ui/b1-09/all-browsers/*.*', 'ui/b1-09/chromium/*.*'],
    //   dependencies: ['b1-09-setup'],
    // },
    // {
    //   name: 'b1-09-firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   testMatch: ['ui/b1-09/all-browsers/*.*'],
    //   dependencies: ['b1-09-setup'],
    // },
    // {
    //   name: 'b1-09-webkit',
    //   use: { ...devices['Desktop Safari'] },
    //   testMatch: ['ui/b1-09/all-browsers/*.*'],
    //   dependencies: ['b1-09-setup'],
    // },
    // {
    //   name: 'b1-09-mobile-chrome',
    //   use: { ...devices['Pixel 7'] },
    //   testMatch: ['ui/b1-09/all-browsers/*.*', 'ui/b1-09/chromium/*.*'],
    //   dependencies: ['b1-09-setup'],
    // },
    // {
    //   name: 'b1-09-mobile-safari',
    //   use: { ...devices['iPhone 14 Pro Max'] },
    //   testMatch: ['ui/b1-09/all-browsers/*.*'],
    //   dependencies: ['b1-09-setup'],
    // },
    // {
    //   name: 'b1-09-msedge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    //   testMatch: ['ui/b1-09/all-browsers/*.*', 'ui/b1-09/chromium/*.*'],
    //   dependencies: ['b1-09-setup'],
    // },
    // {
    //   name: 'b1-09-all-browsers',
    //   testMatch: ['ui/b1-09/teardown.ts'],
    //   dependencies: [
    //     'b1-09-chromium',
    //     'b1-09-firefox',
    //     'b1-09-webkit',
    //     'b1-09-mobile-chrome',
    //     'b1-09-mobile-safari',
    //     'b1-09-msedge',
    //   ],
    // },
    //////////////////////////////////////////////////////
    // B1.11 configs: SignUp with Username
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | false   | false
    //  Phone    | false   | false
    //  Social   | false   |
    //  Username | true    |
    {
      name: 'b1-11-setup',
      testMatch: ['ui/b1-11/setup.ts'],
    },
    {
      name: 'b1-11-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-11/all-browsers/*.*', 'ui/b1-11/chromium/*.*'],
      dependencies: ['b1-11-setup'],
    },
  ],
});
