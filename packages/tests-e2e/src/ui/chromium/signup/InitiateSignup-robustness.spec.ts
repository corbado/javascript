import { test, expect } from '../../../fixtures/UISignupTest';


test.describe('InitiateSignup unproductive user behavior', () => {
    test('with empty name', async ({ signupFlow, page }) => {
        let validEmail = "bob@corbado.com";

        await expect(page.getByPlaceholder('Name')).toHaveValue('');
    
        await page.getByPlaceholder('Email address').click();
        await page.getByPlaceholder('Email address').fill(validEmail);
        await expect(page.getByPlaceholder('Email address')).toHaveValue(validEmail);

        await page.getByRole('button', { name: 'Continue with email' }).click();

        await signupFlow.checkLandedOnPage('InitiateSignup');
        await expect(page.getByText('Please enter a valid name')).toBeVisible();
    });

    // TODO: add when (if?) new restrictions are added to Name

    // test('with invalid name', async ({ page }) => {
    //     let invalidName = "$$$";
    //     let validEmail = "bob@corbado.com";

    //     await page.getByPlaceholder('Name').click();
    //     await page.getByPlaceholder('Name').fill(invalidName);
    //     await expect(page.getByPlaceholder('Name')).toHaveValue(invalidName);
    
    //     await page.getByPlaceholder('Email address').click();
    //     await page.getByPlaceholder('Email address').fill(validEmail);
    //     await expect(page.getByPlaceholder('Email address')).toHaveValue(validEmail);

    //     await expect(page.getByText('Please enter a valid name')).toBeVisible();
    // });

    test('with empty email', async ({ signupFlow, page }) => {
        let validName = "Bob";

        await page.getByPlaceholder('Name').click();
        await page.getByPlaceholder('Name').fill(validName);
        await expect(page.getByPlaceholder('Name')).toHaveValue(validName);

        await expect(page.getByPlaceholder('Email address')).toHaveValue('');

        await page.getByRole('button', { name: 'Continue with email' }).click();

        await signupFlow.checkLandedOnPage('InitiateSignup');
        await expect(page.getByText('Please enter a valid email')).toBeVisible();
    });

    // TODO: add when restrictions are added to Email

    // test('with invalid email', async ({ signupFlow, page }) => {
    //     let validName = "Bob";
    //     let invalidEmail = "bob@bob";

    //     await page.getByPlaceholder('Name').click();
    //     await page.getByPlaceholder('Name').fill(validName);
    //     await expect(page.getByPlaceholder('Name')).toHaveValue(validName);

    //     await page.getByPlaceholder('Email address').click();
    //     await page.getByPlaceholder('Email address').fill(invalidEmail);
    //     await expect(page.getByPlaceholder('Email address')).toHaveValue(invalidEmail);

    //     await page.getByRole('button', { name: 'Continue with email' }).click();

    //     await signupFlow.checkLandedOnPage('InitiateSignup');
    //     await expect(page.getByText('Please enter a valid email')).toBeVisible();
    // });

    // TODO: add duplicate email checks when added
});
