import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('PasskeyCreateScreen unproductive user behavior', () => {
  test('change to OTP method', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    await signupFlow.navigateToPasskeySignupScreen();

    await page.getByRole('button', { name: 'Send email one-time passcode' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EnterOtp);
  });

  test('go back to InitiateSignup', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    await signupFlow.navigateToPasskeySignupScreen();

    await page.getByRole('button', { name: 'Back' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.Start);
  });

  test('go to PasskeyBenefits', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    await signupFlow.navigateToPasskeySignupScreen();

    await page.getByText('Passkeys').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyBenefits);
  });

  // TODO: add when the fix is implemented where cancelling the passkey input doesn't redirect to InitiateSignup page
  // currently doesn't work (can't figure out how to wait for passkey operation to finish)
  test.skip('cancelling passkey input remains on same page', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(false);
    await signupFlow.loadAuth();

    await signupFlow.navigateToPasskeySignupScreen();

    await page.getByRole('button', { name: 'Create your account' }).click();

    await signupFlow.inputPasskey(async () => {
      await page.getByText("Let's get you set up with").click();
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyCreate);
    });
  });
});
