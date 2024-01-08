import { test } from '../../../fixtures/UISignupTest';

test.describe('Signup With Passkey', () => {
  test('when every input is valid', async ({ signupFlow }) => {
    await signupFlow.initiateSignupWithWebAuthn();
    await signupFlow.createPasskey();
    await signupFlow.checkSignUpSuccess();
  });
});

test.afterAll(() => {
  // cleanup emails
});
