import { test } from '../../../fixtures/UISignupTest';

test.describe('Signup with email OTP proper user behavior', () => {
  test('with passkey support', async ({ signupFlow, page }) => {
    await signupFlow.createAccount(true);
    await signupFlow.checkLandedOnPage('PasskeySignup');

    await page.getByRole('button', { name: 'Send email one-time passcode' }).click();
    await signupFlow.checkLandedOnPage('EmailOTP');

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnPage('PasskeyAppend');

    await page.getByRole('button', { name: 'Maybe later' }).click();
    await signupFlow.checkLandedOnPage('LoggedIn');
  });
});
