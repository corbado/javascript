import type { Page } from '@playwright/test';

import { BasePage } from './BasePage';
import { MFAPage } from './MFAPage';
import { ProfilePage } from './ProfilePage';

export class PostLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async visible(): Promise<boolean> {
    return this.waitForHeading('Simplify Your Login');
  }

  autoSkipAfterSignup(): MFAPage {
    return new MFAPage(this.page);
  }

  autoSkip(): ProfilePage {
    return new ProfilePage(this.page);
  }

  async awaitPage(): Promise<PostLoginPage> {
    if (!(await this.visible())) {
      throw new Error('Post login page not visible');
    }

    return this;
  }

  async awaitErrorMessage(text: string): Promise<boolean> {
    return this.waitForText(text);
  }

  async continue(expectAutoAppend: boolean): Promise<ProfilePage> {
    if (!expectAutoAppend) {
      await this.clickButton('Continue');
    }

    await this.expectText('Passkey Created Successfully');
    await this.clickButton('Continue');

    return new ProfilePage(this.page);
  }

  async continueWithCancel(expectAutoAppend: boolean): Promise<void> {
    if (!expectAutoAppend) {
      await this.clickButton('Continue');
    }
  }

  async skip(): Promise<ProfilePage> {
    await this.clickText('Skip');

    return new ProfilePage(this.page);
  }

  async skipAfterSignup(): Promise<MFAPage> {
    await this.clickText('Skip');

    return new MFAPage(this.page).awaitPage();
  }
}
