import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with email OTP proper user behavior', () => {
  test('with no passkey support', async ({ signupFlow }) => {
    await signupFlow.createAccount();
    await signupFlow.checkLandedOnScreen(ScreenNames.EnterOtp);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
