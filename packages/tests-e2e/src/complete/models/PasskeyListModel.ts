import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { VirtualAuthenticator } from './utils/VirtualAuthenticator';
import { SignupInitBlockModel } from './corbado-auth-blocks/SignupInitBlockModel';
import { PasskeyAppendBlockModel } from './corbado-auth-blocks/PasskeyAppendBlockModel';
import { EmailVerifyBlockModel, OtpCodeType } from './corbado-auth-blocks/EmailVerifyBlockModel';
import { expectScreen } from './corbado-auth-blocks/expectScreen';
import { ScreenNames } from '../utils/constants'; // The idea of this model is to only test on PasskeyList

// The idea of this model is to only test on PasskeyList
// We don't want to mix the test with other components (e.g. CorbadoAuthModel)
// PasskeyList is only available to users that are logged in though => this model must be initialized with an existing user
export class PasskeyListModel {
  projectId = '';
  page: Page;
  virtualAuthenticator: VirtualAuthenticator;

  constructor(page: Page, virtualAuthenticator: VirtualAuthenticator) {
    this.page = page;
    this.virtualAuthenticator = virtualAuthenticator;
  }

  async load(projectId: string, passkeySupport?: boolean) {
    this.projectId = projectId;

    if (passkeySupport !== undefined) {
      await this.virtualAuthenticator.addWebAuthn(passkeySupport);
    }

    const url = `/${this.projectId}/auth#signup-init`;
    await this.page.goto(url);
    await this.page.waitForSelector('.cb-container-body');

    // here we 'borrow' a little bit of knowledge from the CorbadoAuthModel (how to signup a user)
    const signupModel = new SignupInitBlockModel(this.page);
    const passkeyAppendModel = new PasskeyAppendBlockModel(this.page, this.virtualAuthenticator);
    const emailVerifyModel = new EmailVerifyBlockModel(this.page);

    const email = SignupInitBlockModel.generateRandomEmail();
    await signupModel.fillEmail(email);
    await signupModel.submitPrimary();
    await passkeyAppendModel.navigateFallbackEmail();
    await emailVerifyModel.fillOtpCode(OtpCodeType.Correct);

    await expectScreen(this.page, ScreenNames.End);
  }

  async appendNewPasskey(complete: boolean) {
    const operationTrigger = () => this.page.getByRole('button', { name: ' Create a Passkey' }).click();
    if (complete) {
      await this.virtualAuthenticator.startAndCompletePasskeyOperation(operationTrigger);
    } else {
      await this.virtualAuthenticator.startAndCancelPasskeyOperation(operationTrigger, () =>
        expect(this.page.getByRole('button', { name: ' Create a Passkey' })).toBeVisible(),
      );
    }
  }

  async deletePasskey(index: number) {
    await this.page.getByAltText('cancel').nth(index).click();
    await this.page.getByRole('button', { name: 'Yes, delete' }).click();
  }

  async expectPasskeys(n: number) {
    await expect(this.page.getByAltText('cancel')).toHaveCount(n);
  }

  expectError(value: string) {
    return expect(this.page.getByText(value)).toBeVisible();
  }
}
