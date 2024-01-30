import { expect, test } from '../../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../../utils/constants';

test.describe('Login with passkey proper user behavior', () => {
  test('from Start', async ({ loginFlow, page }) => {
    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    const [, email] = await loginFlow.createAccount(true);

    await loginFlow.navigateToStartScreen();

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(email);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(email);
    await page.getByRole('button', { name: 'Continue' }).click();

    // second login prompts for passkey
    await loginFlow.inputPasskey(async () => {
      await loginFlow.checkLandedOnScreen(ScreenNames.End);
      await loginFlow.checkPasskeyRegistered();
    });
  });

  test('from Start with conditional UI', async ({ loginFlow, page, channel }) => {
    if (channel) {
      test.skip(channel.includes('msedge'), 'Edge does not support conditional UI');
    }

    await loginFlow.initializeCDPSession();
    await loginFlow.addWebAuthn(true);
    await loginFlow.loadAuth();

    void (await loginFlow.createAccount(true));

    await loginFlow.navigateToStartScreen();

    // Conditional UI shows up when email textbox is selected
    await page.getByPlaceholder('Email address').click();
    await loginFlow.inputPasskey(async () => {
      await loginFlow.checkLandedOnScreen(ScreenNames.End);
      await loginFlow.checkPasskeyRegistered();
    });
  });
});
