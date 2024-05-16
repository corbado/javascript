import { test } from '../../../fixtures/UISignupTest';
import { OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Signup with phone OTP proper user behavior', () => {
  test('with passkey support', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    const [, , phone] = await signupFlow.fillIdentifiers(false, false, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await page.getByText('Phone verification').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtpSignup, undefined, phone);

    await signupFlow.fillOTP(OtpType.Phone);
    //TODO: uncomment this after fixing the issue
    // await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    // await page.getByText('Maybe later').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
