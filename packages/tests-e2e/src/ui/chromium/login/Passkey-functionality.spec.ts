import { expect, test } from '../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('Login with passkey proper user behavior', () => {
  test('from Start', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true);

    await loginFlow.navigateToStartScreen();

    // disable automatic passkey input before conditional UI is available
    await loginFlow.setWebAuthnAutomaticPresenceSimulation(false);

    // conditional UI shows up when email textbox is selected
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(email);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(email);

    // deselect email textbox to make conditional UI disappear
    await page.getByRole('heading', { level: 1 }).click();
    await page.getByRole('button', { name: 'Continue' }).click();

    // enable automatic passkey input after conditional UI is gone
    await loginFlow.setWebAuthnAutomaticPresenceSimulation(true);

    // first login requires OTP
    await loginFlow.checkLandedOnScreen(ScreenNames.EnterOtp);
    await loginFlow.fillOTP();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkPasskeyRegistered();

    await page.getByRole('button', { name: 'Logout' }).click();

    await loginFlow.loadAuth();
    await loginFlow.navigateToStartScreen();

    await loginFlow.setWebAuthnAutomaticPresenceSimulation(false);
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(email);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(email);
    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.setWebAuthnAutomaticPresenceSimulation(true);

    // second login does not require OTP
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkPasskeyRegistered();
  });

  test('from Start with conditional UI', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true);

    await loginFlow.navigateToStartScreen();

    await loginFlow.setWebAuthnAutomaticPresenceSimulation(false);
    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(email);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(email);
    await page.getByRole('heading', { level: 1 }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.setWebAuthnAutomaticPresenceSimulation(true);

    // first login requires OTP
    await loginFlow.checkLandedOnScreen(ScreenNames.EnterOtp);
    await loginFlow.fillOTP();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkPasskeyRegistered();

    await page.getByRole('button', { name: 'Logout' }).click();

    await loginFlow.loadAuth();
    await loginFlow.navigateToStartScreen();

    // Conditional UI shows up when email textbox is selected (and automatically processed)
    await page.getByPlaceholder('Email address').click();

    // second login does not require OTP
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkPasskeyRegistered();
  });

  test('from PasskeyAppend', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true, false);
    await loginFlow.navigateToPasskeyAppendScreen(email);

    await page.getByRole('button', { name: 'Activate' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkPasskeyRegistered();
  });

  test('from PasskeyBenefits', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true, false);
    await loginFlow.navigateToPasskeyBenefitsScreen(email);

    await page.getByRole('button', { name: 'Create passkey' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.End);
    await loginFlow.checkPasskeyRegistered();
  });
});
