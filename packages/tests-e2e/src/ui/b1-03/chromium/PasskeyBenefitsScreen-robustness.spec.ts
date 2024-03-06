import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('PasskeyBenefitsScreen unproductive user behavior', () => {
  test('skip to identifier verification', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    const [, email] = await signupFlow.navigateToPasskeyBenefitsScreen();
    await page.getByRole('button', { name: 'Send email verification code' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtp, email);
  });

  test('canceling passkey input redirects to PasskeyErrorScreen', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(false);
    await signupFlow.loadAuth();

    await signupFlow.navigateToPasskeyBenefitsScreen();
    await page.getByRole('button', { name: 'Create passkey' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyError);
    });
  });
});