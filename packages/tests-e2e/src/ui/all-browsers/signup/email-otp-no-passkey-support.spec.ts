import { test } from '../../../fixtures/UISignupTest';

test.describe('Signup With Email OTP when no passkey support available', () => {
  test('when every input is valid', async ({ signupFlow }) => {
    await signupFlow.initiateSignup();
    await signupFlow.fillOTP();
    await signupFlow.checkSignUpSuccess();
  });
});

test.afterAll(() => {
  // cleanup emails
});
