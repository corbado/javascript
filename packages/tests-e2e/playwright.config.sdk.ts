import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['shared/**/*.*', 'sdk/**/*.*'],
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   testMatch: ['shared/all-browsers/**/*.*', 'sdk/all-browsers/**/*.*'],
    // },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['shared/all-browsers/**/*.*', 'sdk/all-browsers/**/*.*'],
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: ['shared/**/*.*', 'sdk/**/*.*'],
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
      testMatch: ['shared/all-browsers/**/*.*', 'sdk/all-browsers/**/*.*'],
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testMatch: ['shared/**/*.*', 'sdk/**/*.*'],
    },
  ],
});
