import type { Page } from '@playwright/test';

import type { AuthenticatorApp } from '../utils/AuthenticatorApp';
import { BasePage } from './BasePage';
import { PostLoginPage } from './PostLoginPage';
import { ProfilePage } from './ProfilePage';

export class MFAPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visible(): Promise<boolean> {
    return this.waitForHeading('Protect your account');
  }

  async awaitPage(): Promise<MFAPage> {
    if (!(await this.visible())) {
      throw new Error('MFA page not visible');
    }

    return this;
  }

  async setupAndConfirmTOTPReturnProfile(authenticator: AuthenticatorApp): Promise<[string, ProfilePage]> {
    await this.clickButton('Use Authenticator instead');

    const sharedKey = await this.page.getByRole('img').getAttribute('aria-label');
    if (!sharedKey) throw new Error('sharedKey not found');

    await this.clickButton('Continue');

    const code1 = await authenticator.addBySecret(sharedKey);
    if (!code1) throw new Error('Failed to add TOTP secret');
    await this.inputTOTP(code1);

    return [sharedKey, new ProfilePage(this.page)];
  }

  async confirm(code: string): Promise<PostLoginPage> {
    await this.page.keyboard.type(code);
    return new PostLoginPage(this.page);
  }

  async inputTOTP(code: string): Promise<void> {
    await this.page.getByRole('textbox').fill(code);
  }
}
