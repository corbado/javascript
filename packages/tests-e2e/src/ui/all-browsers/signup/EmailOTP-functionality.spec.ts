import { test } from '../../../fixtures/UISignupTest';

test.describe('Signup with email OTP proper user behavior', () => {
  test('with no passkey support', async ({ signupFlow }) => {
    await signupFlow.createAccount(false);
    await signupFlow.checkLandedOnPage('EmailOTP');

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnPage('LoggedIn');
  });
});
