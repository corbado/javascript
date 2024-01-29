import { test } from '../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Login with email OTP proper user behavior', () => {
  test('with passkey support', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true, false);
    await loginFlow.navigateToEnterOtpScreen(email);

    await loginFlow.fillOTP();
    await loginFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Maybe later' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkNoPasskeyRegistered();
  });
});
