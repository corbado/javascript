import { test, expect } from '../../../fixtures/UISignupTest';

test.describe('EmailOTP unproductive user behavior', () => {
  test('go back to InitiateSignup', async ({ signupFlow, page }) => {
    await signupFlow.navigateToEmailOTPPage(false, false);

    await page.getByRole('button', { name: 'Cancel' }).click();
    await signupFlow.checkLandedOnPage('InitiateSignup');
  });

  test('try to continue with incomplete OTP', async ({ signupFlow, page }) => {
    await signupFlow.navigateToEmailOTPPage(false, false);

    await signupFlow.fillOTP(true, false);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnPage('EmailOTP');
    await expect(page.getByText('The provided one-time passcode is not valid')).toBeVisible();
  });

  test('try to continue with incorrect OTP', async ({ signupFlow, page }) => {
    await signupFlow.navigateToEmailOTPPage(false, false);

    await signupFlow.fillOTP(false, true);
    await expect(page.getByText('The provided one-time passcode is not valid')).toBeVisible();
    await signupFlow.checkLandedOnPage('EmailOTP');
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnPage('EmailOTP');
  });

  test('click external links', async ({ signupFlow, page }) => {
    await signupFlow.navigateToEmailOTPPage(false, false);

    const newTabPromise1 = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Google' }).click();
    const newTab1 = await newTabPromise1;
    await newTab1.waitForLoadState();
    expect(newTab1.url()).toContain('google');

    const newTabPromise2 = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Yahoo' }).click();
    const newTab2 = await newTabPromise2;
    await newTab2.waitForLoadState();
    expect(newTab2.url()).toContain('yahoo');

    const newTabPromise3 = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'Outlook' }).click();
    const newTab3 = await newTabPromise3;
    await newTab3.waitForLoadState();
    expect(newTab3.url()).toContain('outlook');
  });
});
