import { test } from '../../../fixtures/UISignupTest';

test.describe('PasskeyAppend unproductive user behavior', () => {
  test('go to PasskeyBenefits', async ({ signupFlow, page }) => {
    await signupFlow.navigateToPasskeyAppendPage(true);
    
    await page.getByText('Passkeys').click();
    await signupFlow.checkLandedOnPage('PasskeyBenefits');
  });

  test('cancelling passkey input goes to LoggedIn', async ({ signupFlow, page }) => {
    await signupFlow.navigateToPasskeyAppendPage(false);
    
    await page.getByRole('button', { name: 'Activate' }).click();
    await signupFlow.checkLandedOnPage('LoggedIn');
  });

  test('declining goes to LoggedIn', async ({ signupFlow, page }) => {
    await signupFlow.navigateToPasskeyAppendPage(true);
    
    await page.getByRole('button', { name: 'Maybe later'}).click();
    await signupFlow.checkLandedOnPage('LoggedIn');
  });
});
