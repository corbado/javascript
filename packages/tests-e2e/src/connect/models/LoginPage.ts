import type { Page } from '@playwright/test';

import { BasePage } from './BasePage';
import { PostLoginPage } from './PostLoginPage';
import { ProfilePage } from './ProfilePage';
import { SignupPage } from './SignupPage';

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
      case LoginStatus.PasskeyTextField:
        return this.waitForButton('Login');
      case LoginStatus.FallbackFirst:
        return this.waitForButton('Login');
      case LoginStatus.FallbackSecondTOTP:
        return this.waitForHeading('Check your authenticator');
      case LoginStatus.PasskeyErrorSoft:
      default:
        return true;
    }
  }

  async loginWithOneTap(): Promise<ProfilePage> {
    await this.clickButton('Login with Passkey');

    return new ProfilePage(this.page);
  }

  async loginWithOneTapAndCancel(): Promise<LoginPage> {
    await this.clickButton('Login with Passkey');
    // Stay on login page after cancel
    return LoginPage.awaitPage(this.page);
  }

  async switchAccount(): Promise<void> {
    await this.clickText('Switch account');
  }

  loginWithCUI(): ProfilePage {
    return new ProfilePage(this.page);
  }

  async loginWithIdentifier(email: string): Promise<ProfilePage> {
    await this.page.getByLabel('Email address').fill(email);
    await this.clickButton('Login');

    return new ProfilePage(this.page);
  }

  async loginWithIdentifierAndPasswordIdentifierFirst(email: string, password: string): Promise<void> {
    await this.page.getByLabel('Email address').fill(email);
    await this.clickButton('Login');
    await this.page.getByLabel('Password').fill(password);
    await this.clickButton('Login');
  }

  async loginWithIdentifierAndPassword(email: string, password: string) {
    await this.page.getByLabel('Email address').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.clickButton('Login');
  }

  async completeLoginWithTOTP(code: string): Promise<PostLoginPage> {
    await this.page.getByRole('textbox').fill(code);
    return new PostLoginPage(this.page);
  }

  async loginWithIdentifierButNoSuccess(email: string): Promise<void> {
    await this.page.getByLabel('Email address').fill(email);
    await this.clickButton('Login');
  }

  async awaitErrorMessage(text: string): Promise<boolean> {
    return this.waitForText(text);
  }
}
