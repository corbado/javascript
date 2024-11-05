import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const socialLogin = async (page: Page)=> {
  const microsoftEmail = process.env.PLAYWRIGHT_MICROSOFT_EMAIL ?? '';
  const microsoftPassword = process.env.PLAYWRIGHT_MICROSOFT_PASSWORD ?? '';

  await page.getByTitle(`Continue with Microsoft`).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in');

  await page.getByRole('textbox', { name: 'email' }).click();
  await page.getByRole('textbox', { name: 'email' }).fill(microsoftEmail);
  await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue(microsoftEmail);

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Enter password');

  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill(microsoftPassword);
  await expect(page.getByPlaceholder('Password')).toHaveValue(microsoftPassword);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stay signed in?');

  await page.getByRole('button', { name: 'No' }).click();
};
