import { test } from '../../../fixtures/UISignupTest';
import { OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Signup with passkey proper user behavior', () => {
  test('before verifying identifier', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    const [, email] = await signupFlow.fillIdentifiers(false, true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await signupFlow.simulateSuccessfulPasskeyInput(() => page.getByRole('button', { name: 'Create account' }).click());
    //TODO: uncomment this after fixing the issue
    // await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);

    // await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await signupFlow.fillOTP(OtpType.Email);
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });

  test('after verifying identifier', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    const [, email] = await signupFlow.fillIdentifiers(false, true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await page.getByText('Email verification').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await signupFlow.fillOTP(OtpType.Email);
    //TODO: uncomment this after fixing the issue
    // await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    // await signupFlow.simulateSuccessfulPasskeyInput(() => page.getByRole('button', { name: 'Create passkey' }).click());
    //TODO: uncomment this after fixing the issue
    // await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);

    // await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });
});
