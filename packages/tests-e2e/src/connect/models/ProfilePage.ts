import type { Page } from '@playwright/test';

import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';

export enum ProfileStatus {
  ListEmpty,
  ListWithInitialError,
  ListWithPasskeys,
  ListWithoutPasskeySupport,
}

export class ProfilePage extends BasePage {
  page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  async awaitPage(): Promise<ProfilePage> {
    if (!(await this.visible())) {
      throw new Error('Profile page not visible');
    }

    return this;
  }

  visible(): Promise<boolean> {
    return this.waitForHeading('Your profile');
  }

  async logout(): Promise<LoginPage> {
    await this.page.getByRole('button', { name: 'Logout' }).click();

    return LoginPage.awaitPage(this.page);
  }

  async appendPasskey() {
    return this.clickButton('Add a passkey');
  }

  async deletePasskeyByIndex(index: number, complete: boolean) {
    const item = this.page.locator('div.cb-passkey-list-item-delete-icon').nth(index);
    await item.click();
    if (complete) {
      await this.page.locator('.cb-modal').getByRole('button', { name: 'Delete' }).click();
    } else {
      await this.page.locator('.cb-modal').getByRole('button', { name: 'Cancel' }).click();
    }
  }

  async awaitState(status: ProfileStatus): Promise<boolean> {
    switch (status) {
      case ProfileStatus.ListEmpty:
        return this.waitForText('There is currently no passkey saved for this account.');
      case ProfileStatus.ListWithInitialError:
        return this.waitForText('We were unable to show you your list of passkeys due to an error. Try again later.');
      case ProfileStatus.ListWithPasskeys:
        return this.waitBySelector('div.cb-passkey-list-item-delete-icon');
      case ProfileStatus.ListWithoutPasskeySupport: {
        const appendAllowed = await this.waitForText('Add a passkey');
        return !appendAllowed;
      }
    }
  }

  async getPasskeyCount(): Promise<number> {
    const passkeyList = this.page.locator('div.cb-passkey-list-item-delete-icon');
    return await passkeyList.count();
  }

  async awaitErrorMessage(text: string): Promise<boolean> {
    return this.waitForText(text);
  }
}
