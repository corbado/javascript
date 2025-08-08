import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

import { operationTimeout, totalTimeout } from './src/connect/utils/Constants';

if (process.env.CI) {
  dotenv.config({ path: path.resolve(__dirname, '.env.connect.ci'), override: true });
} else {
  dotenv.config({ path: path.resolve(__dirname, '.env.connect.local'), override: true });
}

export default defineConfig({
  testDir: './src/connect2',
  // fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 4,
  workers: process.env.CI
    ? process.env.PLAYWRIGHT_NUM_CORES
      ? parseInt(process.env.PLAYWRIGHT_NUM_CORES, 10) - 1
      : undefined
    : undefined,
  reporter: [
    // [
    //   '../../node_modules/playwright-slack-report/dist/src/SlackReporter.js',
    //   {
    //     channels: ['corbado-tests'],
    //     sendResults: 'always',
    //     showInThread: true,
    //     meta: [
    //       {
    //         key: 'Test Run Info',
    //         value: `https://github.com/corbado/javascript/actions/runs/${process.env.GITHUB_RUN_ID}`,
    //       },
    //       { key: 'branch', value: `${process.env.GITHUB_BRANCH_NAME}` },
    //     ],
    //   },
    // ],
    ['html'],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  timeout: totalTimeout, // default: 30000ms
  expect: {
    timeout: operationTimeout, // default: 5000ms
  },
  use: {
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 15.3.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
    actionTimeout: operationTimeout, // default: none
    navigationTimeout: operationTimeout, // default: none
    // baseURL: process.env.PLAYWRIGHT_TEST_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'append-component',
      testMatch: ['scenarios/append.spec.ts'],
    },
  ],
  globalSetup: 'src/connect/utils/Playground.ts',
});
