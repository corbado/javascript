import { test } from '../../../fixtures/UISignupTest';
import { OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Signup with phone OTP proper user behavior', () => {
  test.skip('with no passkey support', async ({ signupFlow, page }) => {
    const [, , phone] = await signupFlow.fillIdentifiers(false, false, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtpSignup, undefined, phone);

    await signupFlow.fillOTP(OtpType.Phone);
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
