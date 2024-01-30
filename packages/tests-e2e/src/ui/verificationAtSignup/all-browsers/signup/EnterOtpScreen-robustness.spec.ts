import { expect, test } from '../../../../fixtures/UISignupTest';
import { OtpType, ScreenNames } from '../../../../utils/constants';

test.describe('EnterOtpScreen unproductive user behavior', () => {
  // TODO: unskip when bug is fixed
  test.skip('go back to InitiateSignup', async ({ signupFlow, page }) => {
    await signupFlow.navigateToEnterOtpScreen(false);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.Start);
  });

  test('try to continue with incorrect OTP', async ({ signupFlow, page }) => {
    await signupFlow.navigateToEnterOtpScreen(false);

    await signupFlow.fillOTP(OtpType.Incorrect);
    await expect(page.getByText('The provided one-time passcode is not valid')).toBeVisible();
    await signupFlow.checkLandedOnScreen(ScreenNames.EnterOtp);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EnterOtp);
  });
});
