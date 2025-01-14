import type { Page } from '@playwright/test';

import type { ErrorTexts } from '../utils/Constants';
import { ScreenNames } from '../utils/Constants';
import { expectError, expectScreen } from '../utils/ExpectScreen';
import type { NetworkRequestBlocker } from '../utils/NetworkRequestBlocker';
import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';
import { AppendModel } from './AppendModel';
import { HomeModel } from './HomeModel';
import { LoginModel } from './LoginModel';
import { PasskeyListModel } from './PasskeyListModel';
import { SignupModel } from './SignupModel';

export class BaseModel {
  page: Page;
  authenticator: VirtualAuthenticator;
  blocker: NetworkRequestBlocker;
  signup: SignupModel;
  login: LoginModel;
  append: AppendModel;
  home: HomeModel;
  passkeyList: PasskeyListModel;
  email = '';

  constructor(page: Page, authenticator: VirtualAuthenticator, blocker: NetworkRequestBlocker) {
    this.page = page;
    this.authenticator = authenticator;
    this.blocker = blocker;
    this.signup = new SignupModel(page);
    this.login = new LoginModel(page, authenticator);
    this.append = new AppendModel(page, authenticator);
    this.home = new HomeModel(page);
    this.passkeyList = new PasskeyListModel(page, authenticator);
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

  loadHome() {
    return this.page.goto('/home');
  }

  expectScreen(screenName: ScreenNames) {
    return expectScreen(this.page, screenName);
  }

  expectError(message: ErrorTexts) {
    return expectError(this.page, message);
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

  async clearLocalStorageAndCookies() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.context().clearCookies();
  }
}
