import { test } from '../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Login with email OTP proper user behavior', () => {
  test('with no passkey support', async ({ loginFlow }) => {
    const [, email] = await loginFlow.createAccount(false);
    await loginFlow.navigateToEnterOtpScreen(email);

    await loginFlow.fillOTP();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkNoPasskeyRegistered();
  });
});
