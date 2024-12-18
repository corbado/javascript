import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ScreenNames } from './Constants';

export const expectScreen = async (page: Page, screenName: ScreenNames) => {
  switch (screenName) {
    case ScreenNames.InitSignup:
      await expect(page.locator('div.font-bold.text-xl')).toHaveText('Signup');
      return;

    case ScreenNames.PasskeyAppend:
      await expect(page.locator('.cb-connect-container').locator('.cb-append-header')).toHaveText(
        'Simplify Your Login',
      );
      return;

    case ScreenNames.PasskeyAppended:
      await expect(page.locator('.cb-connect-container').locator('.cb-append-success-header')).toHaveText(
        'Passkey Created Successfully',
      );
      return;

    case ScreenNames.InitLogin:
      await expect(page.locator('div.font-bold.text-xl')).toHaveText('Login');
      return;

    case ScreenNames.Home:
      await expect(page.locator('div.font-bold.text-xl')).toHaveText('Home');
      return;

    default:
      throw new Error('Invalid screen');
  }
};
