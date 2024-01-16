import { test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Signup with passkey proper user behavior', () => {
  test('from PasskeySignup', async ({ signupFlow, page }) => {
    await signupFlow.createAccount(true);
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyCreate);

    await page.getByRole('button', { name: 'Create your account' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeySuccess);

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
  });

  test('from PasskeyBenefits', async ({ signupFlow, page }) => {
    await signupFlow.createAccount(true);
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyCreate);

    await page.getByText('Passkeys').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyBenefits);

    await page.getByRole('button', { name: 'Create passkey' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeySuccess);

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
  });

  test('from PasskeyAppend', async ({ signupFlow, page }) => {
    await signupFlow.createAccount(true);
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyCreate);

    await page.getByRole('button', { name: 'Send email one-time passcode' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.EnterOtp);

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeyAppend);

    await page.getByRole('button', { name: 'Activate' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.PasskeySuccess);

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.End);
  });
});
