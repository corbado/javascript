import { test } from '../../../fixtures/UISignupTest';
import { OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Signup with passkey proper user behavior', () => {
  test('without verifying identifier', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    await signupFlow.fillIdentifiers(false, true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await page.getByRole('button', { name: 'Create account' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });

  test('after verifying identifier', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    const [, email] = await signupFlow.fillIdentifiers(false, true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await page.getByText('Email verification').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtp, email);

    await signupFlow.fillOTP(OtpType.Email);
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    await page.getByRole('button', { name: 'Create account' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });
});