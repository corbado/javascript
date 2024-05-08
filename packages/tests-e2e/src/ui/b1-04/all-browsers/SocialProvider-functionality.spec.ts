import { expect, test } from '../../../fixtures/UISignupTest';
import { microsoftEmail, microsoftPassword, ScreenNames } from '../../../utils/constants';

test.describe('Signup with Microsoft proper user behavior', () => {
  test('with no passkey support', async ({ signupFlow, page, browserName }) => {
    if (browserName === 'chromium') {
      await signupFlow.initializeCDPSession();
      await signupFlow.addWebAuthn(false);
    }
    await signupFlow.loadAuth();

    await page.getByTitle('Continue with Microsoft').click();
    await expect(page).toHaveURL(/^.*login\.microsoftonline\.com.*$/);
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
    // await expect(page.getByRole('heading', { level: 1 })).toHaveText('Let this app access your info? (1 of 1 apps)');

    // await page.getByRole('button', { name: 'Accept' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
