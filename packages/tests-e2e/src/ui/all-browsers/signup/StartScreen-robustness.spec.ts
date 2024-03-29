import { expect, test } from '../../../fixtures/UISignupTest';
import { ScreenNames } from '../../../utils/constants';

test.describe('StartScreen unproductive user behavior', () => {
  test('with empty name', async ({ signupFlow, page }) => {
    const validEmail = 'bob@corbado.com';

    await expect(page.getByPlaceholder('Name')).toHaveValue('');

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(validEmail);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(validEmail);

    await page.getByRole('button', { name: 'Continue' }).click();

    await signupFlow.checkLandedOnScreen(ScreenNames.Start);
    await expect(page.getByText('Please enter a valid name')).toBeVisible();
  });

  // TODO: add when (if?) new restrictions are added to Name
  test.skip('with invalid name', async ({ signupFlow, page }) => {
    await signupFlow.checkLandedOnScreen(ScreenNames.Start);

    const invalidName = '$$$';
    const validEmail = 'bob@corbado.com';

    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill(invalidName);
    await expect(page.getByPlaceholder('Name')).toHaveValue(invalidName);

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(validEmail);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(validEmail);

    await expect(page.getByText('Please enter a valid name')).toBeVisible();
  });

  test('with empty email', async ({ signupFlow, page }) => {
    const validName = 'Bob';

    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill(validName);
    await expect(page.getByPlaceholder('Name')).toHaveValue(validName);

    await expect(page.getByPlaceholder('Email address')).toHaveValue('');

    await page.getByRole('button', { name: 'Continue' }).click();

    await signupFlow.checkLandedOnScreen(ScreenNames.Start);
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

  // TODO: add when restrictions are added to Email
  test.skip('with invalid email', async ({ signupFlow, page }) => {
    const validName = 'Bob';
    const invalidEmail = 'bob@bob';

    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill(validName);
    await expect(page.getByPlaceholder('Name')).toHaveValue(validName);

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(invalidEmail);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(invalidEmail);

    await page.getByRole('button', { name: 'Continue' }).click();

    await signupFlow.checkLandedOnScreen(ScreenNames.Start);
    await expect(page.getByText('Please enter a valid email')).toBeVisible();
  });

  test('with duplicate email', async ({ signupFlow, page }) => {
    const validName = 'Bob';

    const [, email] = await signupFlow.createDummyAccount();

    await page.getByPlaceholder('Name').click();
    await page.getByPlaceholder('Name').fill(validName);
    await expect(page.getByPlaceholder('Name')).toHaveValue(validName);

    await page.getByPlaceholder('Email address').click();
    await page.getByPlaceholder('Email address').fill(email);
    await expect(page.getByPlaceholder('Email address')).toHaveValue(email);

    await page.getByRole('button', { name: 'Continue' }).click();

    await signupFlow.checkLandedOnScreen(ScreenNames.Start);
    await expect(page.getByText('Email address is already in use')).toBeVisible();
  });

  test('switch to Login flow', async ({ signupFlow, page }) => {
    await signupFlow.checkLandedOnScreen(ScreenNames.Start);

    await page.getByText('Log in').click();

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome back!');
  });
});
