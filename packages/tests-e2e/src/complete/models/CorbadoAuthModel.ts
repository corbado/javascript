import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { ScreenNames } from '../utils/constants';
import { EmailVerifyBlockModel, OtpCodeType } from './corbado-auth-blocks/EmailVerifyBlockModel';
import { expectScreen } from './corbado-auth-blocks/expectScreen';
import { LoginInitBlockModel } from './corbado-auth-blocks/LoginInitBlockModel';
import { PasskeyAppendBlockModel } from './corbado-auth-blocks/PasskeyAppendBlockModel';
import { PasskeyVerifyBlockModel } from './corbado-auth-blocks/PasskeyVerifyBlockModel';
import { PhoneVerifyBlockModel } from './corbado-auth-blocks/PhoneVerifyBlockModel';
import { SignupInitBlockModel } from './corbado-auth-blocks/SignupInitBlockModel';
import type { VirtualAuthenticator } from './utils/VirtualAuthenticator';

export class CorbadoAuthModel {
  projectId = '';
  page: Page;
  virtualAuthenticator: VirtualAuthenticator;
  signupInit: SignupInitBlockModel;
  loginInit: LoginInitBlockModel;
  passkeyAppend: PasskeyAppendBlockModel;
  passkeyVerify: PasskeyVerifyBlockModel;
  emailVerify: EmailVerifyBlockModel;
  phoneVerify: PhoneVerifyBlockModel;

  constructor(page: Page, virtualAuthenticator: VirtualAuthenticator) {
    this.page = page;
    this.virtualAuthenticator = virtualAuthenticator;

    this.signupInit = new SignupInitBlockModel(page);
    this.loginInit = new LoginInitBlockModel(page);
    this.passkeyAppend = new PasskeyAppendBlockModel(page, virtualAuthenticator);
    this.passkeyVerify = new PasskeyVerifyBlockModel(page, virtualAuthenticator);
    this.emailVerify = new EmailVerifyBlockModel(page);
    this.phoneVerify = new PhoneVerifyBlockModel(page);
  }

  async load(projectId: string, passkeySupport?: boolean, hashCode?: string) {
    this.projectId = projectId;

    let url = `/${this.projectId}/auth`;
    if (hashCode) {
      url += `#${hashCode}`;
    }

    if (passkeySupport !== undefined) {
      await this.virtualAuthenticator.addWebAuthn(passkeySupport);
    }

    await this.page.goto(url);
    await this.page.waitForSelector('.cb-container-body');
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }

  async defaultSignupWithPasskey() {
    const email = SignupInitBlockModel.generateRandomEmail();
    await this.signupInit.fillEmail(email);
    await this.signupInit.submitPrimary();
    await this.passkeyAppend.startPasskeyOperation(true);
    await this.logout();

    return email;
  }

  async defaultSignupWithFallback() {
    const email = SignupInitBlockModel.generateRandomEmail();
    await this.signupInit.fillEmail(email);
    await this.signupInit.submitPrimary();
    await this.passkeyAppend.navigateFallbackEmail();
    await this.emailVerify.fillOtpCode(OtpCodeType.Correct);
    await this.logout();

    return email;
  }

  expectScreen(screenName: ScreenNames) {
    return expectScreen(this.page, screenName);
  }

  expectError(value: string) {
    return expect(this.page.getByText(value)).toBeVisible();
  }
}
