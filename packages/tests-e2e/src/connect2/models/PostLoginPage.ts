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

  static async awaitPage(page: Page): Promise<PostLoginPage> {
    const postLoginPage = new PostLoginPage(page);
    if (!(await postLoginPage.visible())) {
      throw new Error('Post login page not visible');
    }

    return postLoginPage;
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

    return ProfilePage.awaitPage(this.page);
  }

  async continueWithCancel(expectAutoAppend: boolean): Promise<PostLoginPage> {
    if (!expectAutoAppend) {
      await this.clickButton('Continue');
    }

    return PostLoginPage.awaitPage(this.page);
  }

  async skip(): Promise<ProfilePage> {
    await this.clickButton('Skip');

    return new ProfilePage(this.page);
  }

  async skipAfterSignup(): Promise<MFAPage> {
    await this.clickButton('Skip');

    return new MFAPage(this.page);
  }
}
