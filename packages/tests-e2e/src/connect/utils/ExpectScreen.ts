import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ErrorTexts } from './Constants';
import { ScreenNames } from './Constants';

export const expectScreen = async (page: Page, screenName: ScreenNames): Promise<void> => {
  switch (screenName) {
    case ScreenNames.InitSignup:
      await expect(page.locator('div.font-bold.text-xl')).toHaveText('Signup');
      return;

    case ScreenNames.InitLogin:
      await expect(page.locator('div.cb-connect-login').getByRole('textbox', { name: 'Email address' })).toBeVisible();
      return;

    case ScreenNames.InitLoginFallback:
      await expect(page.locator('div.font-bold.text-xl')).toHaveText('Login');
      return;

    case ScreenNames.InitLoginOneTap:
      await expect(page.locator('div.cb-connect-login')).toContainText('Welcome back');
      return;

    case ScreenNames.PasskeyAppend:
      await expect(page.locator('.cb-connect-container').locator('.cb-append-header')).toContainText(
        'Simplify Your Login',
      );
      return;

    case ScreenNames.PasskeyAppended:
      await expect(page.locator('.cb-connect-container').locator('.cb-append-success-header')).toContainText(
        'Passkey Created Successfully',
      );
      return;

    case ScreenNames.Home:
      await expect(page.locator('div.font-bold.text-xl')).toHaveText('Home');
      return;

    case ScreenNames.PasskeyList:
      await expect(page.locator('.cb-connect-passkey-list')).toBeVisible();
      return;

    case ScreenNames.PasskeyError1:
      await expect(page.locator('.cb-connect-container').locator('.cb-login-header')).toContainText(
        'Use your passkey to confirm it’s really you',
      );
      return;

    case ScreenNames.PasskeyError2:
      await expect(page.locator('.cb-connect-container').locator('.cb-login-header')).toContainText(
        'Something went wrong!',
      );
      return;

    case ScreenNames.MFA:
      await expect(page.locator('div.font-bold.text-xl')).toHaveText('MFA');
      return;

    default:
      throw new Error('Invalid screen');
  }
};

export const expectError = (page: Page, message: ErrorTexts): Promise<void> => {
  // This error message isn't a part of cb-container, so it doesn't come as cb-notification-text.
  if (message === ErrorTexts.DeletedPasskeyUsed || message === ErrorTexts.PasskeySignatureValidationFail) {
    return expect(page.getByText(message)).toBeVisible();
  }
  return expect(page.locator('.cb-notification-text')).toHaveText(message);
};
