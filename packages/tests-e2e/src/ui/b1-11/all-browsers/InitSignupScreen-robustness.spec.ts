import { expect, test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';
import UserManager from '../../../utils/UserManager';

test.describe('InitSignupScreen unproductive user behavior', () => {
  // TODO: unskip when new error message is implemented
  test.skip('without passkey support', async ({ signupFlow, page, browserName, context }, testInfo) => {
    if (browserName === 'chromium') {
      await signupFlow.initializeCDPSession();
      await signupFlow.addWebAuthn(false);
    }
    await signupFlow.loadAuth();
    await signupFlow.printTestInfo(page, context, testInfo);
    await signupFlow.checkLandedOnScreen(ScreenNames.InitSignup);

    const id = UserManager.getUserForSignup();
    const username = id.replace('+', '-');

    await page.getByRole('textbox', { name: 'username' }).click();
    await page.getByRole('textbox', { name: 'username' }).fill(username);
    await expect(page.getByRole('textbox', { name: 'username' })).toHaveValue(username);

    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(
      page.getByText('This app requires passkey authentication. Please use a compatible device.'),
    ).toBeVisible();
  });
});
