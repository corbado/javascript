import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { SocialProviderType } from '../../utils/constants';
import { getRandomIntegerN } from '../../utils/random';

export class SignupInitBlockModel {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  static generateRandomEmail() {
    const randomness = getRandomIntegerN(6);
    return `integration-test+${randomness}@corbado.com`;
  }

  static generateRandomPhone() {
    const randomness = getRandomIntegerN(4);
    return `+1650555${randomness}`;
  }

  static generateRandomUsername() {
    const randomness = getRandomIntegerN(6);
    return `integration-test-${randomness}`;
  }

  async navigateToLogin() {
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }

  async fillEmail(value: string) {
    const elem = this.page.getByRole('textbox', { name: 'email' });
    await elem.click();
    await elem.fill(value);
  }

  async fillPhone(value: string) {
    const elem = this.page.getByRole('textbox', { name: 'phone' });
    await elem.click();
    await elem.fill(value);
  }

  async fillUsername(value: string) {
    const elem = this.page.getByRole('textbox', { name: 'username' });
    await elem.click();
    await elem.fill(value);
  }

  fillFullName(value: string) {
    return;
  }

  submitPrimary() {
    return this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async submitSocialMicrosoft() {
    const microsoftEmail = process.env.PLAYWRIGHT_MICROSOFT_EMAIL ?? '';
    const microsoftPassword = process.env.PLAYWRIGHT_MICROSOFT_PASSWORD ?? '';

    await this.page.getByTitle(`Continue with Microsoft`).click();
    await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Sign in');

    await this.page.getByRole('textbox', { name: 'email' }).click();
    await this.page.getByRole('textbox', { name: 'email' }).fill(microsoftEmail);
    await expect(this.page.getByRole('textbox', { name: 'email' })).toHaveValue(microsoftEmail);

    await this.page.getByRole('button', { name: 'Next' }).click();
    await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Enter password');

    await this.page.getByPlaceholder('Password').click();
    await this.page.getByPlaceholder('Password').fill(microsoftPassword);
    await expect(this.page.getByPlaceholder('Password')).toHaveValue(microsoftPassword);

    await this.page.getByRole('button', { name: 'Sign in' }).click();
    await expect(this.page.getByRole('heading', { level: 1 })).toHaveText('Stay signed in?');

    await this.page.getByRole('button', { name: 'No' }).click();
  }

  expectErrorMissingUsername(): Promise<void> {
    return this.#expectError('Please enter a username.');
  }

  expectErrorMissingEmail(): Promise<void> {
    return this.#expectError('Please enter an email address.');
  }

  expectErrorMissingPhoneNumber(): Promise<void> {
    return this.#expectError('Please enter a phone number.');
  }

  expectErrorInvalidUsername(): Promise<void> {
    return this.#expectError('Username must be between 4 and 32 characters');
  }

  expectErrorInvalidEmail(): Promise<void> {
    return this.#expectError('Please enter a valid email address.');
  }

  expectErrorInvalidPhoneNumber(): Promise<void> {
    return this.#expectError('Please enter a valid phone number.');
  }

  expectErrorDuplicateUsername(): Promise<void> {
    return this.#expectError('This username is already taken. Please try another one or log in with this one.');
  }

  expectErrorDuplicateEmail(): Promise<void> {
    return this.#expectError('This email address is already taken. Please try another one or log in with this one.');
  }

  expectErrorDuplicatePhone(): Promise<void> {
    return this.#expectError('This phone number is already taken. Please try another one or log in with this one.');
  }

  async expectSocialButton(...type: SocialProviderType[]) {
    for (const t of type) {
      await expect(this.page.getByTitle(`Continue with ${t}`)).toBeVisible();
    }
  }

  #expectError(value: string): Promise<void> {
    return expect(this.page.getByText(value)).toBeVisible();
  }
}
