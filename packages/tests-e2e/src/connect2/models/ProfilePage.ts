import type { Page } from '@playwright/test';

import { BasePage } from './BasePage';
import { LoginPage } from './LoginPage';

export enum ProfileStatus {
  ListEmpty,
  ListWithInitialError,
  ListWithPasskeys,
}

export class ProfilePage extends BasePage {
  page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }

  static async awaitPage(page: Page): Promise<ProfilePage> {
    const profilePage = new ProfilePage(page);
    await profilePage.visible();

    return profilePage;
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

  async deletePasskeyByIndex(index: string, complete: boolean) {}

  async awaitState(status: ProfileStatus): Promise<boolean> {
    switch (status) {
      case ProfileStatus.ListEmpty:
        return this.waitForButton('No passkeys');
      case ProfileStatus.ListWithInitialError:
        return this.waitForText('Error loading passkeys');
      case ProfileStatus.ListWithPasskeys:
        return this.waitBySelector('div.cb-passkey-list-item-delete-icon');
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
