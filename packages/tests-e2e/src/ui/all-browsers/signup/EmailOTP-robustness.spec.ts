import { test, expect } from '../../../fixtures/UISignupTest';

test.describe('EmailOTP unproductive user behavior', () => {
  test('go back to InitiateSignup', async ({ signupFlow, page }) => {
    await signupFlow.navigateToEmailOTPPage(false, false);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await signupFlow.checkLandedOnPage('InitiateSignup');
  });

  test('try to continue with incomplete OTP', async ({ signupFlow, page }) => {
    await signupFlow.navigateToEmailOTPPage(false, false);

    await signupFlow.fillOTP(true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnPage('EmailOTP');
    await expect(page.getByText('The provided OTP is not valid')).toBeVisible();
  });

  test('try to continue with incorrect OTP', async ({ signupFlow, page }) => {
    await signupFlow.navigateToEmailOTPPage(false, false);

    await signupFlow.fillOTP(false, true);
    await expect(page.getByText('The provided OTP is not valid')).toBeVisible();
    await signupFlow.checkLandedOnPage('EmailOTP');
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnPage('EmailOTP');
  });
});
