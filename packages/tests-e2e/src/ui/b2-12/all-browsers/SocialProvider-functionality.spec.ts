import { expect, test } from '../../../fixtures/UILoginTest';
import { microsoftEmail, microsoftPassword, ScreenNames } from '../../../utils/constants';

test.describe('Login with Microsoft proper user behavior', () => {
  test('with no passkey support', async ({ loginFlow, page, browserName }) => {
    if (browserName === 'chromium') {
      await loginFlow.initializeCDPSession();
      await loginFlow.addWebAuthn(false);
    }
    await loginFlow.loadAuth();

    await loginFlow.createAccountWithSocial();

    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByTitle('Continue with Microsoft').click();
    await expect(page).toHaveURL(/^.*account\.live\.com.*$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Let this app access your info? (1 of 1 apps)');
    
    await page.getByRole('button', { name: 'Accept' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkNoPasskeyRegistered();
  });
});
