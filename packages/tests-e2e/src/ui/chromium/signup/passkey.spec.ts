import { test } from '../../../fixtures/UISignup';

test.describe('Signup With Passkey', () => {
  test('when every input is valid', async ({ signupPage }) => {
    await signupPage.initiateSignupWithWebAuthn();
    await signupPage.createPasskey();
    await signupPage.checkSignUpSuccess();
  });
});

test.afterAll(() => {
  // cleanup emails
});