import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { generateToken } from 'node-2fa';

export const googleLogin = async (page: Page, gmail: string, password: string, secret: string) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in');
  const idBox = page.getByLabel('Email or phone');
  await idBox.click();
  await idBox.fill(gmail);
  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome');
  const pwBox = page.getByLabel('Enter your password');
  await pwBox.click();
  await pwBox.fill(password);
  await page.getByRole('button', { name: 'Next' }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('2-Step Verification');
  const codeBox = page.getByLabel('Enter code');
  await codeBox.click();
  const firstTOTP = generateTOTP(secret);
  await codeBox.fill(firstTOTP);
  await page.getByRole('button', { name: 'Next' }).click();
  try {
    await page.getByRole('button', { name: 'Compose' }).waitFor();
    return;
  } catch {
    // TOTP failed, so the code must've been used during previous login.
    // Wait for the next code.
    const nextTOTP = await generateNextTOTP(firstTOTP, secret);
    await codeBox.fill(nextTOTP);
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('button', { name: 'Compose' })).toBeVisible();
  }
};

const generateNextTOTP = async (previousTOTP: string, secret: string) => {
  const currentTOTP = generateTOTP(secret);
  if (currentTOTP !== previousTOTP) {
    return currentTOTP;
  }
  const timestamp = Math.floor(Date.now() / 1000);
  console.log(timestamp);
  const timeWindow = timestamp % 30;
  console.log(timeWindow);
  const waitTime = (30 - timeWindow) * 1000 + 1000;
  console.log(waitTime);
  await new Promise(resolve => setTimeout(resolve, waitTime));
  console.log(Math.floor(Date.now() / 1000));
  return generateTOTP(secret);
};

const generateTOTP = (secret: string) => {
  console.log('Secret:', secret);
  const result = generateToken(secret);
  console.log('Result from generateToken:', result);
  expect(result).not.toBeNull();

  return result!.token;
};

export const getEmailOtpCode = async (
  page: Page,
  projectName = 'Corbado',
  loggedIn = false,
  gmail: string,
  password: string,
  secret: string,
) => {
  if (loggedIn) {
    // Wait for OTP code to arrive
    await page.waitForTimeout(7000);
  }

  const gmailPage = await page.context().newPage();
  await gmailPage.goto('https://mail.google.com');

  if (!loggedIn) {
    await googleLogin(gmailPage, gmail, password, secret);
  }

  const inboxEntry = gmailPage.getByRole('link', { name: `is your ${projectName}` }).first();
  const emailTitle = await inboxEntry.innerText();

  await gmailPage.close();

  return emailTitle.split(' ')[0];
};

export const socialLogin = async (page: Page, gmail: string, password: string, secret: string) => {
  const gmailPage = await page.context().newPage();
  await gmailPage.goto('https://mail.google.com');

  await googleLogin(gmailPage, gmail, password, secret);
  await gmailPage.close();

  await page.getByRole('button', { name: 'Continue with Google' }).click();
  await expect(page.getByRole('heading')).toHaveText('Choose an account');

  await page.getByRole('button', { name: 'Corbado Systemtest' }).click();
  await expect(page.getByRole('heading')).toHaveText('corbado-staging.io wants to access your Google Account');

  await page.getByRole('button', { name: 'Allow' }).click();
};

export const repeatSocialLogin = async (page: Page) => {
  await page.getByRole('button', { name: 'Continue with Google' }).click();
  await expect(page.getByRole('heading')).toHaveText('Choose an account');

  await page.getByRole('button', { name: 'Corbado Systemtest' }).click();
  await expect(page.getByRole('heading')).toHaveText('corbado-staging.io wants to access your Google Account');

  await page.getByRole('button', { name: 'Allow' }).click();
};
