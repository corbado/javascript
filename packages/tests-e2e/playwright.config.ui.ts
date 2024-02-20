import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI
    ? process.env.PLAYWRIGHT_NUM_WORKERS
      ? parseInt(process.env.PLAYWRIGHT_NUM_WORKERS, 10)
      : undefined
    : undefined,
  reporter: 'html',
  timeout: 15000, // default: 30000ms
  expect: {
    timeout: 3000, // default: 5000ms
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/**/*.*'],
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   testMatch: ['ui/all-browsers/**/*.*'],
    // },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['ui/all-browsers/**/*.*'],
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] },
      testMatch: ['ui/**/*.*'],
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 14 Pro Max'] },
      testMatch: ['ui/all-browsers/**/*.*'],
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testMatch: ['ui/**/*.*'],
    },
  ],
});
