import type { Page } from '@playwright/test';

import type { ErrorTexts } from '../utils/Constants';
import { ScreenNames } from '../utils/Constants';
import { expectError, expectScreen } from '../utils/ExpectScreen';
import type { NetworkRequestBlocker } from '../utils/NetworkRequestBlocker';
import type { VirtualAuthenticator } from '../utils/VirtualAuthenticator';
import { AppendModel } from './AppendModel';
import { HomeModel } from './HomeModel';
import { LoginModel } from './LoginModel';
import { MFAModel } from './MFAModel';
import { PasskeyListModel } from './PasskeyListModel';
import { SignupModel } from './SignupModel';
import { StorageModel } from './StorageModel';
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
  storage: StorageModel;
  mfa: MFAModel;
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
    this.storage = new StorageModel(page);
    this.mfa = new MFAModel(page);
  }

  loadSignup(port: number) {
    return this.page.goto(`http://localhost:${port.toString()}/signup`);
  }

  loadLogin(port: number) {
    return this.page.goto(`http://localhost:${port.toString()}/login`);
  }

  loadHome(port: number) {
    return this.page.goto(`http://localhost:${port.toString()}/home`);
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
    this.mfa.registerTokenUsed();
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
}
