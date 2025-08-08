import type { Page } from '@playwright/test';

import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';
import { PostLoginPage } from './PostLoginPage';

export class SignupPage extends BasePage {
  private readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  visible(): Promise<boolean> {
    return this.waitForHeading('Sign up');
  }

  static async awaitPage(page: Page): Promise<SignupPage> {
    const signupPage = new SignupPage(page);
    if (!(await signupPage.visible())) {
      throw new Error('Signup page not visible');
    }

    return signupPage;
  }

  async navigateToLogin(): Promise<LoginPage> {
    await this.page.getByRole('button', { name: 'Login instead' }).click();

    return new LoginPage(this.page);
  }

  async submit(email: string, phoneNumber: string, password: string): Promise<PostLoginPage> {
    await this.page.getByPlaceholder('Email').fill(email);
    await this.page.getByPlaceholder('Phone').fill(phoneNumber);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign up' }).click();

    return new PostLoginPage(this.page);
  }
}
