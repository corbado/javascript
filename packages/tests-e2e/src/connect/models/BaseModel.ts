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
import { WebhookModel } from './WebhookModel';

export class BaseModel {
  page: Page;
  authenticator: VirtualAuthenticator;
  blocker: NetworkRequestBlocker;
  signup: SignupModel;
  login: LoginModel;
  append: AppendModel;
  home: HomeModel;
  passkeyList: PasskeyListModel;
  webhook: WebhookModel;
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
    this.webhook = new WebhookModel(page);
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
        await this.append.appendPasskey(true);
        await this.expectScreen(ScreenNames.PasskeyAppended);
        await this.append.confirmAppended();
      } else {
        await this.append.skipAppend();
      }
    }
  }

  async clearLocalStorageAndCookies() {
    await this.page.evaluate(() => localStorage.clear());
    await this.page.context().clearCookies();
  }
}
