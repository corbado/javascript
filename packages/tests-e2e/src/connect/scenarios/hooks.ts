import type {
  PlaywrightTestArgs,
  PlaywrightTestOptions,
  PlaywrightWorkerArgs,
  PlaywrightWorkerOptions,
  TestType,
} from '@playwright/test';

import type { BaseModel } from '../models/BaseModel';
import { password, ScreenNames } from '../utils/Constants';

export function setupVirtualAuthenticator(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
) {
  test.beforeEach(async ({ model }) => {
    await model.addWebAuthn();
  });

  test.afterEach(async ({ model }) => {
    await model.removeWebAuthn();
  });
}

// export function loadInvitationToken(
//   test: TestType<
//     PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
//     PlaywrightWorkerArgs & PlaywrightWorkerOptions
//   >,
// ) {
//   test.beforeEach(async ({ model }) => {
//     await model.loadInvitationToken();
//   });
// }

export function loadSignup(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
) {
  test.beforeEach(async ({ model }) => {
    await model.loadSignup();
  });
}

export function loadLogin(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >,
) {
  test.beforeEach(async ({ model }) => {
    await model.loadLogin();
  });
}

export function setupUser(
  test: TestType<
    PlaywrightTestArgs & PlaywrightTestOptions & { model: BaseModel },
    PlaywrightWorkerArgs & PlaywrightWorkerOptions
  >, invited = true, append = true,
) {
  test.beforeEach(async ({ model }) => {
    if (invited) {
      await model.loadInvitationToken();
    }
    await model.loadSignup();
    await model.expectScreen(ScreenNames.InitSignup);
    await model.createUser(invited, append);
    await model.expectScreen(ScreenNames.Home);
  });

  // test.afterEach(async ({ model }) => {
  //   await model.deleteUser();
  // });
}

// assumes that setupUser(test, true, false) has been called right before
export function loadPasskeyAppend(
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
    await model.expectScreen(ScreenNames.PasskeyAppend);
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
