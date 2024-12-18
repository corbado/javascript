import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import { ScreenNames } from '../utils/Constants';
import { expectScreen } from '../utils/ExpectScreen';
import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';
import { AppendModel } from './AppendModel';
import { SignupModel } from './SignupModel';

export class BaseModel {
  page: Page;
  authenticator: VirtualAuthenticator;
  signup: SignupModel;
  append: AppendModel;
  email = '';

  constructor(page: Page, authenticator: VirtualAuthenticator) {
    this.page = page;
    this.authenticator = authenticator;
    this.signup = new SignupModel(page);
    this.append = new AppendModel(page, authenticator);
  }

  addWebAuthn() {
    return this.authenticator.addWebAuthn();
  }

  removeWebAuthn() {
    return this.authenticator.removeWebAuthn();
  }

  loadSignup(withInvitationToken = true) {
    if (withInvitationToken) {
      return this.page.goto('/signup?invitationToken=inv-token-correct');
    } else {
      return this.page.goto('/signup');
    }
  }

  loadLogin(withInvitationToken = true) {
    if (withInvitationToken) {
      return this.page.goto('/login?invitationToken=inv-token-correct');
    } else {
      return this.page.goto('/login');
    }
  }

  expectScreen(screenName: ScreenNames) {
    return expectScreen(this.page, screenName);
  }

  async createUser() {
    this.email = await this.signup.autofillCredentials();
    await this.signup.submit();
    await this.expectScreen(ScreenNames.PasskeyAppend);
    await this.append.appendPasskey();
    await this.expectScreen(ScreenNames.PasskeyAppended);
    await this.append.confirmAppended();
  }

  async deleteUser() {
    const cookies = await this.page.context().cookies();
    const longSessionCookie = cookies.find(cookie => cookie.name === 'cbo_long_session');
    const longSessionCookieValue = longSessionCookie?.value;

    expect(longSessionCookieValue).toBeDefined();
    expect(process.env.FRONTEND_API_URL).toBeDefined();

    const response = await fetch(`${process.env.FRONTEND_API_URL}/v2/me`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `cbo_long_session=${longSessionCookieValue}`,
      },
    });

    expect(response.ok).toBeTruthy();
  }
}
