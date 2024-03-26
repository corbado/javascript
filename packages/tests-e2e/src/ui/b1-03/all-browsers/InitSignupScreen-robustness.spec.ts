import { expect, test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

// TODO: remove skips when error messages are fixed in InitSignup
test.describe('InitSignupScreen unproductive user behavior', () => {
  test('with empty username', async ({ signupFlow, page }) => {
    await signupFlow.fillIdentifiers(false, true, true);
    await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue('');
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.InitSignup);
    await expect(page.getByText('Please enter a username.')).toBeVisible();
  });

  test.skip('with duplicate username', async ({ signupFlow, page }) => {
    const [username] = await signupFlow.createAccount();
    await signupFlow.fillIdentifiers(false, true, true);
    await page.getByRole('textbox', { name: 'Username' }).fill(username);
    await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue(username);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('That username is taken. Please try another one.')).toBeVisible();
  });

  test('with invalid username (illegal characters)', async ({ signupFlow, page }) => {
    await signupFlow.fillIdentifiers(false, true, true);
    await page.getByRole('textbox', { name: 'Username' }).fill('!@#$%^&*()');
    await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue('!@#$%^&*()');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(
      page.getByText(
        'Username must be between 4 and 32 characters long and may only consist of alphanumeric characters and "-" or "_".',
      ),
    ).toBeVisible();
  });

  test('with invalid username (length)', async ({ signupFlow, page }) => {
    await signupFlow.fillIdentifiers(false, true, true);
    await page.getByRole('textbox', { name: 'Username' }).fill('a');
    await expect(page.getByRole('textbox', { name: 'Username' })).toHaveValue('a');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(
      page.getByText(
        'Username must be between 4 and 32 characters long and may only consist of alphanumeric characters and "-" or "_".',
      ),
    ).toBeVisible();
  });

  test('with empty email address', async ({ signupFlow, page }) => {
    await signupFlow.fillIdentifiers(true, false, true);
    await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveValue('');
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.InitSignup);
    await expect(page.getByText('Please enter an email address.')).toBeVisible();
  });

  test.skip('with duplicate email address', async ({ signupFlow, page }) => {
    const [, email] = await signupFlow.createAccount();
    await signupFlow.fillIdentifiers(true, false, true);
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveValue(email);
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(
      page.getByText('This email address is already taken. Please try another one or log in with this one.'),
    ).toBeVisible();
  });

  test('with invalid email address', async ({ signupFlow, page }) => {
    await signupFlow.fillIdentifiers(true, false, true);
    await page.getByRole('textbox', { name: 'Email address' }).fill('a');
    await expect(page.getByRole('textbox', { name: 'Email address' })).toHaveValue('a');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByText('Please enter a valid email address.')).toBeVisible();
  });

  test('with empty phone number', async ({ signupFlow, page }) => {
    await signupFlow.fillIdentifiers(true, true, false);
    await expect(page.getByRole('textbox', { name: 'Phone number' })).toHaveValue('');
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.InitSignup);
    await expect(page.getByText('Please enter a phone number.')).toBeVisible();
  });

  test.skip('with duplicate phone number', async ({ signupFlow, page }) => {
    const [, , phone] = await signupFlow.createAccount();
    await signupFlow.fillIdentifiers(true, true, false);
    await page.getByRole('textbox', { name: 'Phone number' }).fill(phone);
    await expect(page.getByRole('textbox', { name: 'Phone number' })).toHaveValue(phone);
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.InitSignup);
    await expect(
      page.getByText('This phone number is already taken. Please try another one or log in with this one.'),
    ).toBeVisible();
  });

  test('with invalid phone number', async ({ signupFlow, page }) => {
    await signupFlow.fillIdentifiers(true, true, false);
    await page.getByRole('textbox', { name: 'Phone number' }).fill('a');
    await expect(page.getByRole('textbox', { name: 'Phone number' })).toHaveValue('a');
    await page.getByRole('button', { name: 'Continue' }).click();
    await signupFlow.checkLandedOnScreen(ScreenNames.InitSignup);
    await expect(page.getByText('Please enter a valid phone number.')).toBeVisible();
  });

  test.skip('switch to Login flow', async ({ signupFlow, page }) => {
    await page.getByText('Log in').click();
    await signupFlow.checkLandedOnScreen(ScreenNames.InitLogin);
  });
});
