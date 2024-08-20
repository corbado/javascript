import { test } from '../../../fixtures/UISignupTest';
import { OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Signup with passkey proper user behavior', () => {
  test('before verifying identifiers', async ({ signupFlow, page, context }, testInfo) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();
    await signupFlow.printTestInfo(page, context, testInfo);

    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await signupFlow.simulateSuccessfulPasskeyInput(() => page.getByRole('button', { name: 'Create account' }).click());

    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await signupFlow.fillOTP(OtpType.Email);
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtpSignup, undefined, phone);

    await signupFlow.fillOTP(OtpType.Phone);
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });

  test('after verifying identifiers', async ({ signupFlow, page, context }, testInfo) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();
    await signupFlow.printTestInfo(page, context, testInfo);

    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await page.getByText('Email verification').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await signupFlow.fillOTP(OtpType.Email);
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtpSignup, undefined, phone);

    await signupFlow.fillOTP(OtpType.Phone);

    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkNoPasskeyRegistered();
  });

  test('from PasskeyErrorScreen', async ({ signupFlow, page, context }, testInfo) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();
    await signupFlow.printTestInfo(page, context, testInfo);

    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await signupFlow.simulateFailedPasskeyInput(
      () => page.getByRole('button', { name: 'Create account' }).click(),
      () => signupFlow.checkLandedOnScreen(ScreenNames.PasskeyError),
    );

    await signupFlow.simulateSuccessfulPasskeyInput(() => page.getByRole('button', { name: 'Try again' }).click());

    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await signupFlow.fillOTP(OtpType.Email);
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtpSignup, undefined, phone);

    await signupFlow.fillOTP(OtpType.Phone);
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });
});
