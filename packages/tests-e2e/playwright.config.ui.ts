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
  reporter: [
    [
      '../../node_modules/playwright-slack-report/dist/src/SlackReporter.js',
      {
        channels: ['corbado-javascript-tests'],
        sendResults: 'on-failure',
        showInThread: true,
        meta: [
          {
            key: 'Test Run Info',
            value: `https://github.com/corbado/javascript/actions/runs/${process.env.GITHUB_RUN_ID}`,
          },
        ],
      },
    ],
    ['html'],
  ],
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
    // B1.1 configs (Email OTP): Signup with Identifier (unverified)
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
      name: 'b1-01-emailotp-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        'ui/b1-01-emailotp/all-browsers/*-functionality.spec.ts',
        'ui/b1-01-emailotp/chromium/*-functionality.spec.ts',
      ],
      dependencies: ['b1-01-emailotp-setup'],
    },
    {
      name: 'b1-01-emailotp-teardown',
      testMatch: ['ui/b1-01-emailotp/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B1.1 configs (Phone OTP): Signup with Identifier (unverified)
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
      name: 'b1-01-phoneotp-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        'ui/b1-01-phoneotp/all-browsers/*-functionality.spec.ts',
        'ui/b1-01-phoneotp/chromium/*-functionality.spec.ts',
      ],
      dependencies: ['b1-01-phoneotp-setup'],
    },
    {
      name: 'b1-01-phoneotp-teardown',
      testMatch: ['ui/b1-01-phoneotp/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B1.1 configs (Email Link): Signup with Identifier (unverified)
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
      name: 'b1-01-emaillink-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        'ui/b1-01-emaillink/all-browsers/*-functionality.spec.ts',
        'ui/b1-01-emaillink/chromium/*-functionality.spec.ts',
      ],
      dependencies: ['b1-01-emaillink-setup'],
    },
    {
      name: 'b1-01-emaillink-teardown',
      testMatch: ['ui/b1-01-emaillink/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B1.2 configs: Signup with Identifier (verified)
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
      name: 'b1-02-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-02/all-browsers/*-functionality.spec.ts', 'ui/b1-02/chromium/*-functionality.spec.ts'],
      dependencies: ['b1-02-setup'],
    },
    {
      name: 'b1-02-teardown',
      testMatch: ['ui/b1-02/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B1.3 configs: Signup with Identifiers (verified)
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
      name: 'b1-03-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-03/all-browsers/*-functionality.spec.ts', 'ui/b1-03/chromium/*-functionality.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-robustness-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-03/all-browsers/*-robustness.spec.ts', 'ui/b1-03/chromium/*-robustness.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-functionality-firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: ['ui/b1-03/all-browsers/*-functionality.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-robustness-firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: ['ui/b1-03/all-browsers/*-robustness.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-functionality-webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['ui/b1-03/all-browsers/*-functionality.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-robustness-webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['ui/b1-03/all-browsers/*-robustness.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-functionality-mobilechrome',
      use: { ...devices['Pixel 7'] },
      testMatch: ['ui/b1-03/all-browsers/*-functionality.spec.ts', 'ui/b1-03/chromium/*-functionality.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-robustness-mobilechrome',
      use: { ...devices['Pixel 7'] },
      testMatch: ['ui/b1-03/all-browsers/*-robustness.spec.ts', 'ui/b1-03/chromium/*-robustness.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-functionality-mobilesafari',
      use: { ...devices['iPhone 14 Pro Max'] },
      testMatch: ['ui/b1-03/all-browsers/*-functionality.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-robustness-mobilesafari',
      use: { ...devices['iPhone 14 Pro Max'] },
      testMatch: ['ui/b1-03/all-browsers/*-robustness.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-functionality-msedge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testMatch: ['ui/b1-03/all-browsers/*-functionality.spec.ts', 'ui/b1-03/chromium/*-functionality.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-robustness-msedge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testMatch: ['ui/b1-03/all-browsers/*-robustness.spec.ts', 'ui/b1-03/chromium/*-robustness.spec.ts'],
      dependencies: ['b1-03-setup'],
    },
    {
      name: 'b1-03-teardown',
      testMatch: ['ui/b1-03/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B1.4 configs: Signup with Identifier (unverified) and Social
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | false
    //  Phone    | false   | false
    //  Social   | true    |
    //  Username | false   |
    {
      name: 'b1-04-setup',
      testMatch: ['ui/b1-04/setup.ts'],
      teardown: 'b1-04-teardown',
    },
    {
      name: 'b1-04-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-04/all-browsers/*-functionality.spec.ts', 'ui/b1-04/chromium/*-functionality.spec.ts'],
      dependencies: ['b1-04-setup'],
    },
    {
      name: 'b1-04-teardown',
      testMatch: ['ui/b1-04/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B1.11 configs: Signup with Username
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
      name: 'b1-11-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b1-11/all-browsers/*-functionality.spec.ts', 'ui/b1-11/chromium/*-functionality.spec.ts'],
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
      name: 'b2-01-emailotp-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        'ui/b2-01-emailotp/all-browsers/*-functionality.spec.ts',
        'ui/b2-01-emailotp/chromium/*-functionality.spec.ts',
      ],
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
      name: 'b2-01-phoneotp-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        'ui/b2-01-phoneotp/all-browsers/*-functionality.spec.ts',
        'ui/b2-01-phoneotp/chromium/*-functionality.spec.ts',
      ],
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
      name: 'b2-01-emaillink-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        'ui/b2-01-emaillink/all-browsers/*-functionality.spec.ts',
        'ui/b2-01-emaillink/chromium/*-functionality.spec.ts',
      ],
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
      name: 'b2-03-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b2-03/all-browsers/*-functionality.spec.ts', 'ui/b2-03/chromium/*-functionality.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-robustness-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b2-03/all-browsers/*-robustness.spec.ts', 'ui/b2-03/chromium/*-robustness.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-functionality-firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: ['ui/b2-03/all-browsers/*-functionality.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-robustness-firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: ['ui/b2-03/all-browsers/*-robustness.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-functionality-webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['ui/b2-03/all-browsers/*-functionality.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-robustness-webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['ui/b2-03/all-browsers/*-robustness.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-functionality-mobilechrome',
      use: { ...devices['Pixel 7'] },
      testMatch: ['ui/b2-03/all-browsers/*-functionality.spec.ts', 'ui/b2-03/chromium/*-functionality.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-robustness-mobilechrome',
      use: { ...devices['Pixel 7'] },
      testMatch: ['ui/b2-03/all-browsers/*-robustness.spec.ts', 'ui/b2-03/chromium/*-robustness.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-functionality-mobilesafari',
      use: { ...devices['iPhone 14 Pro Max'] },
      testMatch: ['ui/b2-03/all-browsers/*-functionality.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-robustness-mobilesafari',
      use: { ...devices['iPhone 14 Pro Max'] },
      testMatch: ['ui/b2-03/all-browsers/*-robustness.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-functionality-msedge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testMatch: ['ui/b2-03/all-browsers/*-functionality.spec.ts', 'ui/b2-03/chromium/*-functionality.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-robustness-msedge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testMatch: ['ui/b2-03/all-browsers/*-robustness.spec.ts', 'ui/b2-03/chromium/*-robustness.spec.ts'],
      dependencies: ['b2-03-setup'],
    },
    {
      name: 'b2-03-teardown',
      testMatch: ['ui/b2-03/teardown.ts'],
    },
    //////////////////////////////////////////////////////
    // B1.4 configs: Login with Identifier (unverified) and Social
    //           | enabled | enforced
    //  ---------|---------|----------
    //  Email    | true    | false
    //  Phone    | false   | false
    //  Social   | true    |
    //  Username | false   |
    {
      name: 'b2-12-setup',
      testMatch: ['ui/b2-12/setup.ts'],
      teardown: 'b2-12-teardown',
    },
    {
      name: 'b2-12-functionality-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/b2-12/all-browsers/*-functionality.spec.ts', 'ui/b2-12/chromium/*-functionality.spec.ts'],
      dependencies: ['b2-12-setup'],
    },
    {
      name: 'b2-12-teardown',
      testMatch: ['ui/b2-12/teardown.ts'],
    },

    //////////////////////////////////////////////////////
    // nightly test group
    {
      name: 'nightly',
      testMatch: ['ui/nightly/*'],
      dependencies: [
        'b1-01-emailotp-functionality-chromium',
        'b1-01-phoneotp-functionality-chromium',
        'b1-01-emaillink-functionality-chromium',
        'b1-02-functionality-chromium',
        'b1-03-functionality-chromium',
        'b1-03-robustness-chromium',
        'b1-03-functionality-firefox',
        'b1-03-robustness-firefox',
        'b1-03-functionality-webkit',
        'b1-03-robustness-webkit',
        'b1-03-functionality-mobilechrome',
        'b1-03-robustness-mobilechrome',
        'b1-03-functionality-mobilesafari',
        'b1-03-robustness-mobilesafari',
        'b1-03-functionality-msedge',
        'b1-03-robustness-msedge',
        'b1-11-functionality-chromium',
        'b2-01-emailotp-functionality-chromium',
        'b2-01-phoneotp-functionality-chromium',
        'b2-01-emaillink-functionality-chromium',
        'b2-03-functionality-chromium',
        'b2-03-robustness-chromium',
        'b2-03-functionality-firefox',
        'b2-03-robustness-firefox',
        'b2-03-functionality-webkit',
        'b2-03-robustness-webkit',
        'b2-03-functionality-mobilechrome',
        'b2-03-robustness-mobilechrome',
        'b2-03-functionality-mobilesafari',
        'b2-03-robustness-mobilesafari',
        'b2-03-functionality-msedge',
        'b2-03-robustness-msedge',
      ],
    },
    //////////////////////////////////////////////////////
    // commitly test group
    {
      name: 'commitly',
      testMatch: ['ui/commitly/*'],
      dependencies: [
        'b1-01-emailotp-functionality-chromium',
        'b1-01-phoneotp-functionality-chromium',
        'b1-01-emaillink-functionality-chromium',
        'b1-02-functionality-chromium',
        'b1-03-functionality-chromium',
        'b1-11-functionality-chromium',
        'b2-01-emailotp-functionality-chromium',
        'b2-01-phoneotp-functionality-chromium',
        'b2-01-emaillink-functionality-chromium',
        'b2-03-functionality-chromium',
      ],
    },
  ],
});
