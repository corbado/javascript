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
import { PreconditionType, ToolingSidebarModel } from './ToolingSidebarModel';

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

type InitialSidebarActions = {
  setLoginWithIdentifier?: 'complete' | 'cancel' | 'error' | 'not-started';
  setLoginWithoutIdentifier?: 'complete' | 'cancel' | 'error' | 'not-started';
  setCreateAction?: 'complete' | 'cancel' | 'error' | 'not-started';
  createInitialUser?: PreconditionType;
};

type InitialSidebarResult = {
  email: string;
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

  async load(
    projectId: string,
    port: number,
    hashCode?: string,
    initialSidebarActions?: InitialSidebarActions,
  ): Promise<InitialSidebarResult> {
    this.projectId = projectId;
    const url1 = `http://localhost:${port.toString()}`;
    await this.page.goto(url1);

    const initialSidebarResult: InitialSidebarResult = {
      email: '',
    };

    const initialMockAuthState = defaultObserveMockAuthState;
    if (initialSidebarActions) {
      if (initialSidebarActions.setLoginWithIdentifier) {
        initialMockAuthState.login.withIdentifier = initialSidebarActions.setLoginWithIdentifier;
        initialMockAuthState.enabled = true;
      }
      if (initialSidebarActions.setLoginWithoutIdentifier) {
        initialMockAuthState.login.withoutIdentifier = initialSidebarActions.setLoginWithoutIdentifier;
        initialMockAuthState.enabled = true;
      }
      if (initialSidebarActions.setCreateAction) {
        initialMockAuthState.create.action = initialSidebarActions.setCreateAction;
        initialMockAuthState.enabled = true;
      }
    }

    if (initialSidebarActions?.createInitialUser) {
      const tooling = new ToolingSidebarModel(this.page);
      const { email } = await tooling.createUser(initialSidebarActions.createInitialUser);
      initialSidebarResult.email = email;
    }

    if (!this.#bootstrapInstalled) {
      await this.page.addInitScript(observeInitScript, initialMockAuthState);
      this.#bootstrapInstalled = true;
    }

    let url2 = `http://localhost:${port.toString()}/${this.projectId}/auth`;
    if (hashCode) {
      url2 += `#${hashCode}`;
    }

    await this.page.goto(url2);
    await this.page.waitForSelector('.cb-container-body');

    return initialSidebarResult;
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
