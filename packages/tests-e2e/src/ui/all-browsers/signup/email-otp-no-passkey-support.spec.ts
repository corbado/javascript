import { test } from '../../../fixtures/UISignup';

test.describe('Signup With Email OTP when no passkey support available', () => {
  test('when every input is valid', async ({ signupPage }) => {
    await signupPage.initiateSignup();
    await signupPage.fillOTP();
    await signupPage.checkSignUpSuccess();
  });
});

test.afterAll(() => {
  // cleanup emails
});
