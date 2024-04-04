import { expect, test } from '../../../fixtures/UILoginTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('InitLoginScreen unproductive user behavior', () => {
  test.skip('with empty email address', async ({ loginFlow, page }) => {
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByRole('textbox', { name: 'email' }).click();
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue('');
    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);
    await expect(page.getByText('Please enter an email address.')).toBeVisible();
  });

  test.skip('with invalid email address', async ({ loginFlow, page }) => {
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByRole('textbox', { name: 'email' }).click();
    await page.getByRole('textbox', { name: 'email' }).fill('a@a');
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue('a@a');
    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
  });

  test('with nonexistent email address', async ({ loginFlow, page }) => {
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByRole('textbox', { name: 'email' }).click();
    await page.getByRole('textbox', { name: 'email' }).fill('bob@corbado.com');
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue('bob@corbado.com');
    await page.getByRole('button', { name: 'Continue' }).click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);
    await expect(page.getByText("Couldn't find your account.")).toBeVisible();
  });

  test.skip('switch to Signup flow', async ({ loginFlow, page }) => {
    await page.getByText('Log in').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitLogin);

    await page.getByText('Sign up').click();
    await loginFlow.checkLandedOnScreen(ScreenNames.InitSignup);
  });
});
