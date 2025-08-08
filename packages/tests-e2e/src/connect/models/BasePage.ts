import type { Page } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  abstract visible(): Promise<boolean>;

  clickButton(label: string): Promise<void> {
    return this.page.getByRole('button', { name: label }).click();
  }

  clickLink(label: string): Promise<void> {
    return this.page.getByRole('link', { name: label }).click();
  }

  clickText(text: string): Promise<void> {
    return this.page.getByText(text).click();
  }

  async waitForHeading(text: string): Promise<boolean> {
    try {
      await this.page.getByRole('heading', { name: text }).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForText(text: string): Promise<boolean> {
    try {
      await this.page.getByText(text).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitForButton(label: string): Promise<boolean> {
    try {
      await this.page.getByRole('button', { name: label }).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  async waitBySelector(selector: string): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  expectText(text: string): Promise<void> {
    return this.page.getByText(text).waitFor({ state: 'visible' });
  }

  // client-state
  async clearProcessState(): Promise<void> {
    return this.localStorageClearByPrefix('cbo_connect_process');
  }

  private localStorageClearByPrefix(prefix: string): Promise<void> {
    return this.page.evaluate(prefix => {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      }
    }, prefix);
  }
}
