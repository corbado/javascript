import { test } from '../../../fixtures/UISignupTest';
import { OtpType, ScreenNames } from '../../../utils/constants';

test.describe('Signup with passkey proper user behavior', () => {
  test('before verifying identifiers', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await signupFlow.addPasskeyInput(() => page.getByRole('button', { name: 'Create account' }).click());
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await signupFlow.fillOTP(OtpType.Email);
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtpSignup, undefined, phone);

    await signupFlow.fillOTP(OtpType.Phone);
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });

  test('after verifying identifiers', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await page.getByText('Email verification').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await signupFlow.fillOTP(OtpType.Email);
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtpSignup, undefined, phone);

    await signupFlow.fillOTP(OtpType.Phone);
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend2);

    await signupFlow.addPasskeyInput(() => page.getByRole('button', { name: 'Create passkey' }).click());
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });

  test('from PasskeyErrorScreen', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn();
    await signupFlow.loadAuth();

    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend1);

    await signupFlow.failPasskeyInput(
      () => page.getByRole('button', { name: 'Create account' }).click(),
      () => signupFlow.checkLandedOnScreen(ScreenNames.PasskeyError),
    );

    await signupFlow.addPasskeyInput(() => page.getByRole('button', { name: 'Try again' }).click());
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtpSignup, email);

    await signupFlow.fillOTP(OtpType.Email);
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtpSignup, undefined, phone);

    await signupFlow.fillOTP(OtpType.Phone);
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });
});
