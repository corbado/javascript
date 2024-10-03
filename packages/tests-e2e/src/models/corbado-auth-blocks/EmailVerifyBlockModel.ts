import type { BrowserContext, Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { AuthType } from '../../utils/constants';

export enum OtpCodeType {
  Correct = '150919',
  Incorrect = '654321',
  Incomplete = '15',
}

export enum LinkType {
  Correct = 'UaTwjBJwyDLMGVbR7WHh',
  Incorrect = 'wrong-code',
}

export class EmailVerifyBlockModel {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillOtpCode(type: OtpCodeType) {
    for (let i = 0; i < type.length; i++) {
      await this.page.locator(`#otp-${i}`).fill(type[i]);
    }
  }

  async clickEmailLink(context: BrowserContext, projectID: string, email: string, authType: AuthType, type: LinkType) {
    const link = await this.#generateEmailLink(context, projectID, email, authType, type);
    await this.page.goto(link);
  }

  resend() {
    return this.page.getByRole('button', { name: 'Resend code' }).click();
  }

  navigateToEditIdentifier() {
    return this.page.getByAltText('edit-icon').click();
  }

  async fillNewEmail(value: string) {
    const elem = this.page.getByRole('textbox');
    await elem.click();
    await elem.fill(value);
  }

  submitNewEmail() {
    return this.page.getByRole('button', { name: 'Resend code' }).click();
  }

  abortNewEmail() {
    return this.page.getByRole('button', { name: 'Back' }).click();
  }

  expectErrorWrongCode() {
    return expect(this.page.getByText('The code is invalid or expired')).toBeVisible();
  }

  expectErrorExistingEmail() {
    return expect(
      this.page.getByText('This email address is already taken. Please try another one or log in with this one.'),
    ).toBeVisible();
  }

  async #generateEmailLink(
    context: BrowserContext,
    projectId: string,
    email: string,
    authType: AuthType,
    linkType: LinkType,
  ) {
    const storageState = await context.storageState();
    const localStorage = storageState.origins.find(
      origin => origin.origin.replace(/\/$/, '') === process.env.PLAYWRIGHT_TEST_URL?.replace(/\/$/, ''),
    )?.localStorage;
    console.log('localStorage', localStorage);

    const cboAuthProcessRaw = localStorage?.find(item => item.name === `cbo_auth_process-${projectId}`)?.value;
    if (!cboAuthProcessRaw) {
      throw new Error('getCboAuthProcess: cbo_auth_process not found in local storage');
    }
    const cboAuthProcess = JSON.parse(cboAuthProcessRaw);

    const urlBlock = {
      blockData: {
        alternativeVerificationMethods: null,
        identifier: email,
        retryNotBefore: 1711650294,
        verificationMethod: 'email-link',
      },
      authType: authType,
      process: {
        id: cboAuthProcess.id,
        expires: cboAuthProcess.expires,
        frontendApiUrl: cboAuthProcess.frontendApiUrl,
      },
    };

    const serializedBlock = btoa(JSON.stringify(urlBlock));

    return `${process.env.PLAYWRIGHT_TEST_URL}/${projectId}/auth?corbadoEmailLinkID=${serializedBlock}&corbadoToken=${linkType}`;
  }
}
