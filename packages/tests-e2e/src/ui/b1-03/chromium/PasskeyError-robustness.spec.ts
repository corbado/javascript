import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('PasskeyErrorScreen unproductive user behavior', () => {
  test('skip to identifier verification', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(false);
    await signupFlow.loadAuth();

    const [, email] = await signupFlow.navigateToPasskeyErrorScreen();
    await page.getByRole('button', { name: 'Send email verification code' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtp, email);
  });

  test.skip('canceling passkey input redirects to PasskeyErrorScreen', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(false);
    await signupFlow.loadAuth();

    await signupFlow.navigateToPasskeyErrorScreen();
    await page.getByRole('button', { name: 'Try again' }).click();
    await signupFlow.setWebAuthnUserVerified(true);
    await signupFlow.inputPasskey(async () => {
      await page.getByText('Something went wrong...').click();
      // TODO: wtf how do i check if passkey input doesn't change anything in the page???
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyError);
    });
  });
});