import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with passkey proper user behavior', () => {
  test('before verifying identifiers', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Create your account' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtp, email);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtp, undefined, phone);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    // await signupFlow.checkPasskeyRegistered();
  });

  test('after verifying identifiers', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Send email verification code' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtp, email);

    await signupFlow.fillOTP();
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

  test('from PasskeyBenefitsScreen', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByText('Passkeys').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyBenefits);

    await page.getByRole('button', { name: 'Create passkey' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtp, email);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtp, undefined, phone);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    // await signupFlow.checkPasskeyRegistered();
  });

  test('from PasskeyErrorScreen', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(false);
    await signupFlow.loadAuth();

    const [, email, phone] = await signupFlow.fillIdentifiers(true, true, true);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Create your account' }).click();

    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyError);
    });

    await signupFlow.setWebAuthnUserVerified(true);

    await page.getByRole('button', { name: 'Try again' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppended);
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EmailOtp, email);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.PhoneOtp, undefined, phone);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    // await signupFlow.checkPasskeyRegistered();
  });
});
