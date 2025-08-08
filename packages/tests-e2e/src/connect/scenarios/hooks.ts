import type {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
} from '@playwright/test';

import type { BaseModel } from '../models/BaseModel';
import type { WebhookTypes } from '../utils/Constants';
import { password, ScreenNames } from '../utils/Constants';

export function setupVirtualAuthenticator(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
) {
  test.beforeEach(async ({ model, page }) => {
    await model.authenticator.addWebAuthn();
  });

  test.afterEach(async ({ model }) => {
    await model.authenticator.removeWebAuthn();
  });
}

export function setupNetworkBlocker(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
) {
  test.beforeEach(async ({ model }) => {
    await model.blocker.enableBlocking();
  });
}

export function setupWebhooks(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
  webhookTypes: WebhookTypes[],
) {
  test.beforeEach(async ({ model }) => {
    await model.webhook.createWebhookEndpoint(webhookTypes);
  });

  test.afterEach(async ({ model }) => {
    await model.webhook.deleteWebhookEndpoint();
  });
}

export function loadInvitationToken(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
  getPort: () => number,
) {
  test.beforeEach(async ({ model }) => {
    await model.storage.loadInvitationToken(getPort());
  });
}

export function setupUser(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
  getPort: () => number,
  invited = true,
  append = true,
) {
  test.beforeEach(async ({ model }) => {
    if (invited) {
      await model.storage.loadInvitationToken(getPort());
    }
    await model.loadSignup(getPort());
    await model.expectScreen(ScreenNames.InitSignup);
    await model.createUser(invited, append);
    await model.expectScreen(ScreenNames.Home);
  });
}

// assumes that setupUser(test, true, false) has been called right before
export function loadBeforePasskeyAppend(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
) {
  test.beforeEach(async ({ model }) => {
    await model.home.logout();
    await model.expectScreen(ScreenNames.InitLogin);

    await model.login.submitEmail(model.email, false);
    await model.expectScreen(ScreenNames.InitLoginFallback);

    await model.login.submitFallbackCredentials(model.email, password, true);
    await model.expectScreen(ScreenNames.MFA);
  });
}

// assumes that setupUser(test, true, true) has been called right before
export function loadPasskeyList(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
) {
  test.beforeEach(async ({ model }) => {
    await model.home.gotoPasskeyList();
    await model.expectScreen(ScreenNames.PasskeyList);
  });
}
