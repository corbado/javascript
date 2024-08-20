import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with email OTP proper user behavior', () => {
  test('with no passkey support', async ({ signupFlow, page, browserName, context }, testInfo) => {
    if (browserName === 'chromium') {
      await signupFlow.initializeCDPSession();
      await signupFlow.addWebAuthn(false);
    }
    await signupFlow.loadAuth();
    await signupFlow.printTestInfo(page, context, testInfo);

    await signupFlow.fillIdentifiers(false, true, false);
    await page.getByRole('button', { name: 'Continue' }).click();

    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
