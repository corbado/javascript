import type { Page } from '@playwright/test';

import { BasePage } from './BasePage';
import { SignupPage } from './SignupPage';
import { PostLoginPage } from './PostLoginPage';
import { ProfilePage } from './ProfilePage';

export enum LoginStatus {
  PasskeyOneTap,
  PasskeyTextField,
  FallbackFirst,
  FallbackSecondTOTP,
  PasskeyErrorSoft,
}

export class LoginPage extends BasePage {
  page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  visible(): Promise<boolean> {
    return this.waitForHeading('Login');
  }

  static async awaitPage(page: Page): Promise<LoginPage> {
    const loginPage = new LoginPage(page);
    if (!(await loginPage.visible())) {
      throw new Error('Login page not visible');
    }

    return loginPage;
  }

  async navigateToSignup(): Promise<SignupPage> {
    await this.clickLink('Sign up');

    return SignupPage.awaitPage(this.page);
  }

  async awaitState(status: LoginStatus): Promise<boolean> {
    switch (status) {
      case LoginStatus.PasskeyOneTap:
        return this.waitForButton('Login with Passkey');
      default:
        return true;
    }
  }

  async loginWithOneTap(): Promise<ProfilePage> {
    await this.clickButton('Login with Passkey');

    return ProfilePage.awaitPage(this.page);
  }
}
