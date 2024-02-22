import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with email OTP proper user behavior', () => {
  test('with passkey support', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    await signupFlow.fillIdentifiers(false, true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Send email verification code' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtp);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Maybe later' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
