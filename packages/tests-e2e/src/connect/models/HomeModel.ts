import type { Page } from '@playwright/test';

export class HomeModel {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  logout(): Promise<void> {
    return this.page.getByRole('button', { name: 'Logout' }).click();
  }

  gotoPasskeyList(): Promise<void> {
    return this.page.getByRole('button', { name: 'Passkey List' }).click();
  }
}
