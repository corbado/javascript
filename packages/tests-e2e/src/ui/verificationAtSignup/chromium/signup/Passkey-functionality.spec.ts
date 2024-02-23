import { test } from '../../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../../utils/constants';

test.describe('Signup with passkey proper user behavior', () => {
  test('from PasskeyAppend', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    await signupFlow.createAccount();
    await signupFlow.checkLandedOnScreen(ScreenNames.EnterOtp);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Activate' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeySuccess);
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });
});
