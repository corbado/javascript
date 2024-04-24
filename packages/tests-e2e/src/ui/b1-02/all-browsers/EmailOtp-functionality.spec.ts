import { test } from '../../../fixtures/UISignupTest';
import { OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Signup with email OTP proper user behavior', () => {
  test('with no passkey support', async ({ signupFlow, page }) => {
    await signupFlow.loadAuth();

    const [, email] = await signupFlow.fillIdentifiers(false, true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await signupFlow.fillOTP(OtpType.Email);
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
