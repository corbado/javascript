import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

import { operationTimeout, totalTimeout } from './src/connect/utils/constants';

if (process.env.CI) {
  dotenv.config({ path: path.resolve(__dirname, '.env.ci'), override: true });
} else {
  dotenv.config({ path: path.resolve(__dirname, '.env.local'), override: true });
}

export default defineConfig({
  testDir: './src/connect',
  // fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 4,
  workers: process.env.CI
    ? process.env.PLAYWRIGHT_NUM_CORES
      ? parseInt(process.env.PLAYWRIGHT_NUM_CORES, 10) - 1
      : undefined
    : undefined,
  reporter: [
    [
      '../../node_modules/playwright-slack-report/dist/src/SlackReporter.js',
      {
        channels: ['corbado-tests'],
        sendResults: 'always',
        showInThread: true,
        meta: [
          {
            key: 'Test Run Info',
            value: `https://github.com/corbado/javascript/actions/runs/${process.env.GITHUB_RUN_ID}`,
          },
          { key: 'branch', value: `${process.env.GITHUB_BRANCH_NAME}` },
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
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'corbado-auth-general',
      testMatch: ['scenarios/corbado-auth-general/*.ts'],
    },
    {
      name: 'corbado-auth-component-configs',
      testMatch: ['scenarios/corbado-auth-component-configs/*.ts'],
    },
    {
      name: 'passkey-list-general',
      testMatch: ['scenarios/passkey-list-general/*.ts'],
    },
  ],
});
