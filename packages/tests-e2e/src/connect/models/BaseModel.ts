import type { Page } from '@playwright/test';

import { ScreenNames } from '../utils/Constants';
import { expectScreen } from '../utils/ExpectScreen';
import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';
import { AppendModel } from './AppendModel';
import { HomeModel } from './HomeModel';
import { LoginModel } from './LoginModel';
import { SignupModel } from './SignupModel';

export class BaseModel {
  page: Page;
  authenticator: VirtualAuthenticator;
  signup: SignupModel;
  login: LoginModel;
  append: AppendModel;
  home: HomeModel;
  email = '';

  constructor(page: Page, authenticator: VirtualAuthenticator) {
    this.page = page;
    this.authenticator = authenticator;
    this.signup = new SignupModel(page);
    this.login = new LoginModel(page, authenticator);
    this.append = new AppendModel(page, authenticator);
    this.home = new HomeModel(page);
  }

  addWebAuthn() {
    return this.authenticator.addWebAuthn();
  }

  removeWebAuthn() {
    return this.authenticator.removeWebAuthn();
  }

  loadInvitationToken() {
    return this.page.goto('/login?invitationToken=inv-token-correct');
  }

  loadSignup() {
    return this.page.goto('/signup');
  }

  loadLogin() {
    return this.page.goto('/login');
  }

  expectScreen(screenName: ScreenNames) {
    return expectScreen(this.page, screenName);
  }

  async createUser(invited: boolean, append: boolean) {
    this.email = await this.signup.autofillCredentials();
    await this.signup.submit();
    if (invited) {
      await this.expectScreen(ScreenNames.PasskeyAppend);
      if (append) {
        await this.append.appendPasskey();
        await this.expectScreen(ScreenNames.PasskeyAppended);
        await this.append.confirmAppended();
      } else {
        await this.append.skipAppend();
      }
    }
  }

  // async deleteUser() {
  //   const cookies = await this.page.context().cookies();
  //   const longSessionCookie = cookies.find(cookie => cookie.name === 'cbo_long_session');
  //   const longSessionCookieValue = longSessionCookie?.value;
  //
  //   expect(longSessionCookieValue).toBeDefined();
  //   expect(process.env.FRONTEND_API_URL).toBeDefined();
  //
  //   const response = await fetch(`${process.env.FRONTEND_API_URL}/v2/me`, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Cookie: `cbo_long_session=${longSessionCookieValue}`,
  //     },
  //   });
  //
  //   expect(response.ok).toBeTruthy();
  // }
}
