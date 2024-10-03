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
  // fullyParallel: true,
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
        sendResults: 'always',
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
    {
      name: 'corbado-auth-general',
      testMatch: ['ui/corbado-auth-general/*.ts'],
    },
    {
      name: 'corbado-auth-component-configs',
      testMatch: ['ui/corbado-auth-component-configs/*.ts'],
    },
    {
      name: 'passkey-list-general',
      testMatch: ['ui/passkey-list-general/*.ts'],
    },
    {
      name: 'commitly',
      use: devices['Desktop Chrome'],
      testMatch: ['ui/passkey-list-general/*.ts'],
    },
  ],
});
