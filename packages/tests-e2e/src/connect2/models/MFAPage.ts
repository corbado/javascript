import type { Page } from '@playwright/test';

import { BasePage } from './BasePage';

export class MFAPage extends BasePage {
  private readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }
}
