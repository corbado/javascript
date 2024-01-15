import { test } from '../../../fixtures/UISignupTest';

test.describe('PasskeySignup unproductive user behavior', () => {
  test('change to OTP method', async ({ signupFlow, page }) => {
    await signupFlow.navigateToPasskeySignupPage(true);

    await page.getByRole('button', { name: 'Send email one time code' }).click();
    await signupFlow.checkLandedOnPage('EmailOTP');
  });

  test('go back to InitiateSignup', async ({ signupFlow, page }) => {
    await signupFlow.navigateToPasskeySignupPage(true);

    await page.getByRole('button', { name: 'Back' }).click();
    await signupFlow.checkLandedOnPage('InitiateSignup');
  });

  test('go to PasskeyBenefits', async ({ signupFlow, page }) => {
    await signupFlow.navigateToPasskeySignupPage(true);

    await page.getByText('Passkeys').click();
    await signupFlow.checkLandedOnPage('PasskeyBenefits');
  });

  // TODO: add when the fix is implemented where cancelling the passkey input doesn't redirect to InitiateSignup page
  test.skip('cancelling passkey input remains on same page', async ({ signupFlow, page }) => {
    // Set up virtual passkey authenticator that will fail (simulates user cancelling the passkey operation)
    await signupFlow.navigateToPasskeySignupPage(false);

    // Passkey input operation is automatically processed by this click.
    // However, this click doesn't wait for the page load triggered by the passkey operation to complete.
    await page.getByRole('button', { name: 'Create your account' }).click();
    // So, checking if we're on the same page here will trivially pass, because it takes some time for the page to change if it ever does.

    // Clicking in Playwright waits for the page to load before moving onto the next line.
    // However, it seems to wait for not only the page load triggered by the click itself, but also the page load triggered by the passkey operation.
    await page.getByRole('heading', { level: 1 }).click();
    // So, checking if we remain on the same page after this dummy click ensures that any possible page load has completed before the check.
    await signupFlow.checkLandedOnPage('PasskeySignup');
  });
});
