import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export type PreconditionType =
  | 'confirmed_user_with_pk'
  | 'confirmed_user_with_server_deleted_pk'
  | 'confirmed_user_with_social_google_ok'
  | 'confirmed_user_with_social_google_cancel'
  | 'confirmed_user_with_social_google_back'
  | 'confirmed_user_without_pk'
  | 'unconfirmed_user_without_pk';

type MockAction = 'complete' | 'cancel' | 'error' | 'not-started';
type SocialBehavior = 'success' | 'cancel' | 'error' | 'navigate_back';

const trackedUsersPerPage = new WeakMap<Page, Set<string>>();

export class ToolingSidebarModel {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async openUsersTab() {
    await this.page.getByTestId('tooling-tab-users').click();
  }

  async openAuthTab() {
    await this.page.getByTestId('tooling-tab-auth').click();
  }

  async createUser(precondition: PreconditionType): Promise<{ email: string; userID: string }> {
    await this.openUsersTab();
    const cards = this.page.getByTestId('tooling-user-card');
    const before = await cards.count();

    await this.page.getByTestId('tooling-users-precondition').selectOption(precondition);
    await this.page.getByTestId('tooling-users-create').click();

    await expect
      .poll(async () => cards.count(), {
        message: `Expected a new user card for precondition ${precondition}`,
        timeout: 20_000,
      })
      .toBeGreaterThan(before);

    const firstCard = cards.first();
    const fields = firstCard.locator('p');
    const email = ((await fields.nth(0).textContent()) || '').trim();
    const userID = ((await fields.nth(1).textContent()) || '').trim();
    ToolingSidebarModel.trackUser(this.page, userID);
    return { email, userID };
  }

  async addPasskeyToUser(email: string) {
    await this.openUsersTab();
    const card = this.page
      .getByTestId('tooling-user-card')
      .filter({
        has: this.page.getByText(email, { exact: true }),
      })
      .first();

    await expect(card).toBeVisible();
    const credentialsBefore = await card.locator('.test-credential').count();
    await card.getByRole('button', { name: '+ Passkey' }).click();

    await expect
      .poll(async () => card.locator('.test-credential').count(), {
        message: `Expected passkey to be added for user ${email}`,
      })
      .toBeGreaterThan(credentialsBefore);
  }

  async enableMockAuthenticator() {
    await this.openAuthTab();
    const checkbox = this.page.getByTestId('tooling-auth-enabled');
    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }
  }

  async setPasskeyLoginWithIdentifier(action: MockAction) {
    await this.openAuthTab();
    await this.page.getByTestId('tooling-auth-login-with-identifier').selectOption(action);
  }

  async setPasskeyLoginWithoutIdentifier(action: MockAction) {
    await this.openAuthTab();
    await this.page.getByTestId('tooling-auth-login-without-identifier').selectOption(action);
  }

  async setSocialBehavior(behavior: SocialBehavior) {
    await this.openAuthTab();
    await this.page.getByTestId('tooling-social-behavior').selectOption(behavior);
  }

  async setMockSocialUser(email: string) {
    await this.openAuthTab();
    await this.page.getByTestId('tooling-social-email').fill(email);
    await this.page.getByTestId('tooling-social-set').click();
  }

  async applyAuthenticatorSettings() {
    await this.page.getByTestId('tooling-auth-apply').click();
  }

  static trackUser(page: Page, userID: string) {
    if (!userID) {
      return;
    }
    const existing = trackedUsersPerPage.get(page);
    if (existing) {
      existing.add(userID);
      return;
    }
    trackedUsersPerPage.set(page, new Set([userID]));
  }

  static getTrackedUsers(page: Page): string[] {
    return Array.from(trackedUsersPerPage.get(page) ?? []);
  }

  static clearTrackedUsers(page: Page) {
    trackedUsersPerPage.delete(page);
  }
}
