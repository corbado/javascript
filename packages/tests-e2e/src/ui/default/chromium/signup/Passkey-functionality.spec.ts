import { test } from '../../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../../utils/constants';

test.describe('Signup with passkey proper user behavior', () => {
  test('from PasskeySignup', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    await signupFlow.createAccount();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyCreate);

    await page.getByRole('button', { name: 'Create your account' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeySuccess);
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });

  test('from PasskeyBenefits', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    await signupFlow.createAccount();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyCreate);

    await page.getByText('Passkeys').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyBenefits);

    await page.getByRole('button', { name: 'Create passkey' }).click();
    await signupFlow.inputPasskey(async () => {
      await signupFlow.checkLandedOnScreen(ScreenNames.PasskeySuccess);
    });

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
    await signupFlow.checkPasskeyRegistered();
  });

  test('from PasskeyAppend', async ({ signupFlow, page }) => {
    await signupFlow.initializeCDPSession();
    await signupFlow.addWebAuthn(true);
    await signupFlow.loadAuth();

    await signupFlow.createAccount();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyCreate);

    await page.getByRole('button', { name: 'Send email one-time passcode' }).click();
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
