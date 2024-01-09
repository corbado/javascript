import { test } from '../../../fixtures/UISignupTest';

test.describe('Signup with passkey proper user behavior', () => {
  test('from PasskeySignup', async ({ signupFlow, page }) => {
    await signupFlow.createAccount(true);
    await signupFlow.checkLandedOnPage('PasskeySignup');

    await page.getByRole('button', { name: 'Create your account' }).click();
    await signupFlow.checkLandedOnPage('PasskeyWelcome');

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnPage('LoggedIn');
  });

  test('from PasskeyBenefits', async ({ signupFlow, page }) => {
    await signupFlow.createAccount(true);
    await signupFlow.checkLandedOnPage('PasskeySignup');

    await page.getByText('Passkeys').click();
    await signupFlow.checkLandedOnPage('PasskeyBenefits');

    await page.getByRole('button', { name: 'Create passkey' }).click();
    await signupFlow.checkLandedOnPage('PasskeyWelcome');

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnPage('LoggedIn');
  });

  test('from PasskeyAppend', async ({ signupFlow, page }) => {
    await signupFlow.createAccount(true);
    await signupFlow.checkLandedOnPage('PasskeySignup');

    await page.getByRole('button', { name: 'Send email one time code' }).click();
    await signupFlow.checkLandedOnPage('EmailOTP');

    await signupFlow.fillOTP();
    await signupFlow.checkLandedOnPage('PasswordAppend');

    await page.getByRole('button', { name: 'Activate' }).click();
    await signupFlow.checkLandedOnPage('PasskeyWelcome');

    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnPage('LoggedIn');
  });
});