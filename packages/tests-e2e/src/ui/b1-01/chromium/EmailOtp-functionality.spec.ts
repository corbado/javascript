import { test } from '../../../fixtures/UISignupTest';
import { OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Signup with email OTP proper user behavior', () => {
  test('with passkey support', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    const [, email] = await signupFlow.fillIdentifiers(false, true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await page.getByText('Email verification').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await signupFlow.fillOTP(OtpType.Email);
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    await page.getByText('Maybe later').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
