import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

import type { ScreenNames } from '../utils/constants';
import { EmailVerifyBlockModel } from './corbado-auth-blocks/EmailVerifyBlockModel';
import { expectScreen } from './corbado-auth-blocks/expectScreen';
import { LoginInitBlockModel } from './corbado-auth-blocks/LoginInitBlockModel';
import { PhoneVerifyBlockModel } from './corbado-auth-blocks/PhoneVerifyBlockModel';
import { SignupInitBlockModel } from './corbado-auth-blocks/SignupInitBlockModel';
import { PasskeyAppendBlockModel } from './observe-block-overwrites/PasskeyAppendBlockModel';
import { PasskeyVerifyBlockModel } from './observe-block-overwrites/PasskeyVerifyBlockModel';

type ObserveMockAuthState = {
  enabled: boolean;
  login: {
    withIdentifier: 'complete' | 'cancel' | 'error' | 'not-started';
    withoutIdentifier: 'complete' | 'cancel' | 'error' | 'not-started';
  };
  create: {
    action: 'complete' | 'cancel' | 'error' | 'not-started';
  };
};

const defaultObserveMockAuthState: ObserveMockAuthState = {
  enabled: true,
  login: {
    withIdentifier: 'complete',
    withoutIdentifier: 'not-started',
  },
  create: {
    action: 'complete',
  },
};

const observeInitScript = (initialMockAuthState: ObserveMockAuthState) => {
  const sidKey = 'cbo_dev_session_id';
  let sid = window.localStorage.getItem(sidKey);
  if (!sid) {
    sid = crypto.randomUUID();
    window.localStorage.setItem(sidKey, sid);
  }

  document.cookie = `mock_oidc_dev_session=${sid}; path=/; max-age=300`;

  const behaviorKey = `mock-auth-behavior:${sid}`;
  // Equivalent to initial tooling setup + apply, but only if no state exists yet.
  if (!window.localStorage.getItem(behaviorKey)) {
    window.localStorage.setItem(behaviorKey, JSON.stringify(initialMockAuthState));
  }

  if (typeof PublicKeyCredential !== 'undefined') {
    if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = async () => true;
    }
    if (typeof PublicKeyCredential.isConditionalMediationAvailable === 'function') {
      PublicKeyCredential.isConditionalMediationAvailable = async () => true;
    }
  }
};

export class ObserveAuthModel {
  projectId = '';
  page: Page;
  signupInit: SignupInitBlockModel;
  loginInit: LoginInitBlockModel;
  passkeyAppend: PasskeyAppendBlockModel;
  passkeyVerify: PasskeyVerifyBlockModel;
  emailVerify: EmailVerifyBlockModel;
  phoneVerify: PhoneVerifyBlockModel;

  #bootstrapInstalled = false;

  constructor(page: Page) {
    this.page = page;
    this.signupInit = new SignupInitBlockModel(page);
    this.loginInit = new LoginInitBlockModel(page);
    this.emailVerify = new EmailVerifyBlockModel(page);
    this.phoneVerify = new PhoneVerifyBlockModel(page);
    this.passkeyAppend = new PasskeyAppendBlockModel(page);
    this.passkeyVerify = new PasskeyVerifyBlockModel(page);
  }

  async load(projectId: string, port: number, hashCode?: string, initialMockAuthState?: ObserveMockAuthState) {
    this.projectId = projectId;
    if (!this.#bootstrapInstalled) {
      await this.page.addInitScript(observeInitScript, initialMockAuthState ?? defaultObserveMockAuthState);
      this.#bootstrapInstalled = true;
    }

    let url = `${process.env.PLAYWRIGHT_TEST_URL}:${port.toString()}/${this.projectId}/auth`;
    if (hashCode) {
      url += `#${hashCode}`;
    }

    await this.page.goto(url);
    await this.page.waitForSelector('.cb-container-body');
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }

  expectScreen(screenName: ScreenNames) {
    return expectScreen(this.page, screenName);
  }

  expectError(value: string) {
    return expect(this.page.getByText(value)).toBeVisible();
  }
}
