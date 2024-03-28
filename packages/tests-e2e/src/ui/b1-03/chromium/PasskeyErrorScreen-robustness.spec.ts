import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('PasskeyErrorScreen unproductive user behavior', () => {
  test('skip to identifier verification', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    const [, email] = await signupFlow.navigateToPasskeyErrorScreen();
    await page.getByText('Email verification').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);
  });

  test('canceling passkey input redirects to PasskeyErrorScreen', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    await signupFlow.navigateToPasskeyErrorScreen();
    await signupFlow.failPasskeyInput(
      () => page.getByRole('button', { name: 'Try again' }).click(),
      async () => {
        await page.waitForTimeout(300);
        await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyError);
      },
    );
  });
});
