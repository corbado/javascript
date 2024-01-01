import { expect, test } from '@playwright/test';

import UserManager from '../../../utils/UserManager';

test.describe('Signup With Email OTP when no passkey support available', () => {
  test('when every input is valid', async ({ page }) => {
    const user = UserManager.getUserForSignup();

    // The page will make an API call to fetch project config
    await page.goto('/auth');
    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill(user);
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(`${user}@corbado.com`);
    await page.getByRole('button', { name: 'Continue with email' }).click();

    // The page will make an API call to send otp at the provided email
    await page.locator('#otp-0').fill('1');
    await page.locator('#otp-1').fill('5');
    await page.locator('#otp-2').fill('0');
    await page.locator('#otp-3').fill('9');
    await page.locator('#otp-4').fill('1');
    await page.locator('#otp-5').fill('9');
    // The page will automatically make an API call to verify otp as soon as the otp is filled
    // If the otp is valid, the page will navigate to "/"

    await expect(page).toHaveURL('/');
  });
});

test.afterAll(() => {
  // cleanup emails
});
