import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with phone OTP proper user behavior', () => {
  test.skip('with no passkey support', async ({ signupFlow, page }) => {
    // const [, , phone] = await signupFlow.fillIdentifiers(false, false, true);
    const [, email] = await signupFlow.fillIdentifiers(false, true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    // await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtp, undefined, phone);
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtp, email);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
