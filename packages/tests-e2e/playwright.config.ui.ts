import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_URL,
    trace: 'on-first-retry',
  },
  projects: [
    ////////////////////////////////////////////
    // default configs:
    // - doubleOptIn: true
    // - signupFlow: PasskeyWithEmailOTPFallback
    // - allowUserRegistration: true
    // - userFullNameRequired: true
    {
      name: 'default-setup',
      testMatch: ['ui/default/setup.ts'],
    },
    {
      name: 'default-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/default/**/*.*'],
      dependencies: ['default-setup'],
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    //   testMatch: ['ui/default/all-browsers/**/*.*'],
    // },
    {
      name: 'default-webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['ui/default/all-browsers/**/*.*'],
      dependencies: ['default-setup'],
    },
    {
      name: 'default-mobileChrome',
      use: { ...devices['Pixel 7'] },
      testMatch: ['ui/default/**/*.*'],
      dependencies: ['default-setup'],
    },
    {
      name: 'default-mobileSafari',
      use: { ...devices['iPhone 14 Pro Max'] },
      testMatch: ['ui/default/all-browsers/**/*.*'],
      dependencies: ['default-setup'],
    },
    {
      name: 'default-msedge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
      testMatch: ['ui/default/**/*.*'],
      dependencies: ['default-setup'],
    },
    ////////////////////////////////////////////
    // changed config:
    // - doubleOptIn: false
    {
      name: 'noVerification-setup',
      testMatch: ['ui/noVerification/setup.ts'],
      dependencies: [
        'default-chromium',
        'default-webkit',
        'default-mobileChrome',
        'default-mobileSafari',
        'default-msedge',
      ],
    },
    {
      name: 'noVerification-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/noVerification/**/*.*'],
      dependencies: ['noVerification-setup'],
    },
    ////////////////////////////////////////////
    // changed config:
    // - signupFlow: EmailOTPSignup
    {
      name: 'verificationAtSignup-setup',
      testMatch: ['ui/verificationAtSignup/setup.ts'],
      dependencies: ['noVerification-chromium'],
    },
    {
      name: 'verificationAtSignup-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/verificationAtSignup/**/*.*'],
      dependencies: ['verificationAtSignup-setup'],
    },
    ////////////////////////////////////////////
    // changed config:
    // - allowUserRegistration: false
    {
      name: 'noSignup-setup',
      testMatch: ['ui/noSignup/setup.ts'],
      dependencies: ['verificationAtSignup-chromium'],
    },
    {
      name: 'noSignup-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/noSignup/**/*.*'],
      dependencies: ['noSignup-setup'],
    },
    ////////////////////////////////////////////
    // changed config:
    // - userFullNameRequired: false
    {
      name: 'noName-setup',
      testMatch: ['ui/noName/setup.ts'],
      dependencies: ['noSignup-chromium'],
    },
    {
      name: 'noName-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['ui/noName/**/*.*'],
      dependencies: ['noName-setup'],
    },
  ],
});
