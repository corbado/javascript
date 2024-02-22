import { test } from '../../../fixtures/UISignupTest';

test.describe('Signup with passkey proper user behavior', () => {
  test('without verifying identifier', async ({ signupFlow }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();
  });

  test('after verifying identifier', async ({ signupFlow }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();
  });
});