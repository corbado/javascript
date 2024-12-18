import type { Page } from '@playwright/test';

export enum OtpCodeType {
  Correct = '481926',
  Incorrect = '654321',
  Incomplete = '15',
}

export class PhoneVerifyBlockModel {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async fillOtpCode(type: OtpCodeType) {
    for (let i = 0; i < type.length; i++) {
      await this.page.locator(`#otp-${i}`).fill(type[i]);
    }
  }

  resend() {
    return this.page.getByRole('button', { name: 'Resend code' }).click();
  }

  navigateToEditIdentifier() {
    return this.page.getByAltText('edit-icon').click();
  }

  async fillNewIdentifier(value: string) {
    const elem = this.page.getByRole('textbox');
    await elem.click();
    await elem.fill(value);
  }

  submitNewIdentifier() {
    return this.page.getByRole('button', { name: 'Resend code' }).click();
  }

  abortNewIdentifier() {
    return this.page.getByRole('button', { name: 'Back' }).click();
  }

  expectErrorWrongCode() {
    return expect(this.page.getByText('The code is invalid or expired')).toBeVisible();
  }

  expectErrorExistingIdentifier() {
    return expect(
      this.page.getByText('This email address is already taken. Please try another one or log in with this one.'),
    ).toBeVisible();
  }
}
