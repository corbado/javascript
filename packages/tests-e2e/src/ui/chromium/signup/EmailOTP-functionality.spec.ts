import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with email OTP proper user behavior', () => {
  test('with passkey support', async ({ signupFlow, page }) => {
    await signupFlow.createAccount(true);
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyCreate);

    await page.getByRole('button', { name: 'Send email one-time passcode' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EnterOtp);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Maybe later' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
