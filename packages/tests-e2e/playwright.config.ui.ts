import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

import { operationTimeout, totalTimeout } from './src/utils/constants';

if (process.env.CI) {
  // I have no idea why process.env.PLAYWRIGHT_PROJECT_ID is set as the value in .env.local before
  // this point. This environment variable is not set in the workflow file (e2e-test.yml), so the
  // value should theoretically be undefined. For now the 'override' option fixes the issue.
  dotenv.config({ path: path.resolve(__dirname, '.env.ci'), override: true });
} else {
  dotenv.config({ path: path.resolve(__dirname, '.env.local'), override: true });
}

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 2,
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
  timeout: totalTimeout, // default: 30000ms
  expect: {
    timeout: operationTimeout, // default: 5000ms
  },
  use: {
    actionTimeout: operationTimeout, // default: none
    navigationTimeout: operationTimeout, // default: none
    baseURL: process.env.PLAYWRIGHT_TEST_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    //////////////////////////////////////////////////////
    // B1.1 configs (Email OTP): SignUp with Identifier (unverified)
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | false
    //  Phone    | false   | false
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b1-01-emailotp-setup',
      testMatch: ['ui/b1-01-emailotp/setup.ts'],
      teardown: 'b1-01-emailotp-teardown',
    },
    {
      name: 'b1-01-emailotp-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-01-emailotp/all-browsers/*.*', 'ui/b1-01-emailotp/chromium/*.*'],
      dependencies: ['b1-01-emailotp-setup'],
    },
    {
      name: 'b1-01-emailotp-teardown',
      testMatch: ['ui/b1-01-emailotp/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B1.1 configs (Phone OTP): SignUp with Identifier (unverified)
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | false   | false
    //  Phone    | true    | false
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b1-01-phoneotp-setup',
      testMatch: ['ui/b1-01-phoneotp/setup.ts'],
      teardown: 'b1-01-phoneotp-teardown',
    },
    {
      name: 'b1-01-phoneotp-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-01-phoneotp/all-browsers/*.*', 'ui/b1-01-phoneotp/chromium/*.*'],
      dependencies: ['b1-01-phoneotp-setup'],
    },
    {
      name: 'b1-01-phoneotp-teardown',
      testMatch: ['ui/b1-01-phoneotp/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B1.1 configs (Email Link): SignUp with Identifier (unverified)
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | false
    //  Phone    | false   | false
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b1-01-emaillink-setup',
      testMatch: ['ui/b1-01-emaillink/setup.ts'],
      teardown: 'b1-01-emaillink-teardown',
    },
    {
      name: 'b1-01-emaillink-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-01-emaillink/all-browsers/*.*', 'ui/b1-01-emaillink/chromium/*.*'],
      dependencies: ['b1-01-emaillink-setup'],
    },
    {
      name: 'b1-01-emaillink-teardown',
      testMatch: ['ui/b1-01-emaillink/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B1.2 configs: SignUp with Identifier (verified)
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | true
    //  Phone    | false   | false
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b1-02-setup',
      testMatch: ['ui/b1-02/setup.ts'],
      teardown: 'b1-02-teardown',
    },
    {
      name: 'b1-02-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-02/all-browsers/*.*', 'ui/b1-02/chromium/*.*'],
      dependencies: ['b1-02-setup'],
    },
    {
      name: 'b1-02-teardown',
      testMatch: ['ui/b1-02/teardown.ts'],
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
      teardown: 'b1-03-teardown',
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
      name: 'b1-03-mobilechrome',
      use: { ...devices['Pixel 7'] },
      testMatch: ['ui/b1-03/all-browsers/*.*', 'ui/b1-03/chromium/*.*'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-mobilesafari',
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
      name: 'b1-03-teardown',
      testMatch: ['ui/b1-03/teardown.ts'],
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
    //   teardown: 'b1-09-teardown',
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
    //   name: 'b1-09-mobilechrome',
    //   use: { ...devices['Pixel 7'] },
    //   testMatch: ['ui/b1-09/all-browsers/*.*', 'ui/b1-09/chromium/*.*'],
    //   dependencies: ['b1-09-setup'],
    // },
    // {
    //   name: 'b1-09-mobilesafari',
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
    //   name: 'b1-09-teardown',
    //   testMatch: ['ui/b1-09/teardown.ts'],
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
      teardown: 'b1-11-teardown',
    },
    {
      name: 'b1-11-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-11/all-browsers/*.*', 'ui/b1-11/chromium/*.*'],
      dependencies: ['b1-11-setup'],
    },
    {
      name: 'b1-11-teardown',
      testMatch: ['ui/b1-11/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B2.1 configs (Email OTP): Login with Identifier
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | false
    //  Phone    | false   | false
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b2-01-emailotp-setup',
      testMatch: ['ui/b2-01-emailotp/setup.ts'],
      teardown: 'b2-01-emailotp-teardown',
    },
    {
      name: 'b2-01-emailotp-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b2-01-emailotp/all-browsers/*.*', 'ui/b2-01-emailotp/chromium/*.*'],
      dependencies: ['b2-01-emailotp-setup'],
    },
    {
      name: 'b2-01-emailotp-teardown',
      testMatch: ['ui/b2-01-emailotp/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B2.1 configs (Phone OTP): Login with Identifier
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | false   | false
    //  Phone    | true    | false
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b2-01-phoneotp-setup',
      testMatch: ['ui/b2-01-phoneotp/setup.ts'],
      teardown: 'b2-01-phoneotp-teardown',
    },
    {
      name: 'b2-01-phoneotp-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b2-01-phoneotp/all-browsers/*.*', 'ui/b2-01-phoneotp/chromium/*.*'],
      dependencies: ['b2-01-phoneotp-setup'],
    },
    {
      name: 'b2-01-phoneotp-teardown',
      testMatch: ['ui/b2-01-phoneotp/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B2.1 configs (Email Link): Login with Identifier
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | false
    //  Phone    | false   | false
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b2-01-emaillink-setup',
      testMatch: ['ui/b2-01-emaillink/setup.ts'],
      teardown: 'b2-01-emaillink-teardown',
    },
    {
      name: 'b2-01-emaillink-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b2-01-emaillink/all-browsers/*.*', 'ui/b2-01-emaillink/chromium/*.*'],
      dependencies: ['b2-01-emaillink-setup'],
    },
    {
      name: 'b2-01-emaillink-teardown',
      testMatch: ['ui/b2-01-emaillink/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B2.3 configs: Login with Identifier - enforce single verification before login
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | true
    //  Phone    | false   | false
    //  Social   | false   |
    //  Username | false   |
    {
      name: 'b2-03-setup',
      testMatch: ['ui/b2-03/setup.ts'],
      teardown: 'b2-03-teardown',
    },
    {
      name: 'b2-03-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b2-03/all-browsers/*.*', 'ui/b2-03/chromium/*.*'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: ['ui/b2-03/all-browsers/*.*'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['ui/b2-03/all-browsers/*.*'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-mobilechrome',
      use: { ...devices['Pixel 7'] },
      testMatch: ['ui/b2-03/all-browsers/*.*', 'ui/b2-03/chromium/*.*'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-mobilesafari',
      use: { ...devices['iPhone 14 Pro Max'] },
      testMatch: ['ui/b2-03/all-browsers/*.*'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-msedge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testMatch: ['ui/b2-03/all-browsers/*.*', 'ui/b2-03/chromium/*.*'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-teardown',
      testMatch: ['ui/b2-03/teardown.ts'],
    },
  ],
});
