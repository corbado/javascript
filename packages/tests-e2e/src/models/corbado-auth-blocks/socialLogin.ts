import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export const socialLogin = async (page: Page, email: string, password: string) => {
  await page.getByTitle(`Continue with Microsoft`).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sign in');

  await page.getByRole('textbox', { name: 'email' }).click();
  await page.getByRole('textbox', { name: 'email' }).fill(email);
  await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue(email);

  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Enter password');

  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill(password);
  await expect(page.getByPlaceholder('Password')).toHaveValue(password);

  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Stay signed in?');

  await page.getByRole('button', { name: 'No' }).click();
};
