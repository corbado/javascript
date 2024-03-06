import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with email OTP and phone OTP proper user behavior', () => {
  test.skip('with no passkey support', async ({ signupFlow, page }) => {
    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtp, email);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtp, undefined, phone);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
