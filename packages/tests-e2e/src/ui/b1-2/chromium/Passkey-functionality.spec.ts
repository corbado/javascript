import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with passkey proper user behavior', () => {
  test('before verifying identifier', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    const [, , phone] = await signupFlow.fillIdentifiers(false, false, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Create your account' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtp, undefined, phone);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    // await signupFlow.checkPasskeyRegistered();
  });

  test('after verifying identifier', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    const [, , phone] = await signupFlow.fillIdentifiers(false, false, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Send phone verification code' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtp, undefined, phone);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Create your account' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    // await signupFlow.checkPasskeyRegistered();
  });
});
