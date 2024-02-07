import type { SessionUser } from '@corbado/types';
import type { CorbadoApp } from '@corbado/web-core';
import type { i18n } from 'i18next';

import { passkeyAppendAskTSKey } from './constants';
import type { FlowHandlerStateUpdate, FlowOptions, UserState } from './types';

const defaultUserState: UserState = {
  email: undefined,
  fullName: undefined,
  emailError: undefined,
};

const defaultErrors: UserState = {
  emailError: undefined,
  userNameError: undefined,
  verificationError: undefined,
  lastPasskeyRetryTimeStamp: undefined,
};

const defaultFlowOptions: FlowOptions = {
  passkeyAppend: true,
  retryPasskeyOnError: true,
  verificationMethod: 'emailOtp',
};

/**
 * Internal state of the FlowHandler.
 * This class is responsible for managing the state which is sent to all the flow steps.
 */
export class FlowHandlerState {
  readonly #passkeysSupported: boolean;
  readonly #corbadoApp: CorbadoApp;
  readonly #i18next: i18n;
  readonly #hasPasskeyAppendIntervalPassed: boolean;
  #flowOptions: FlowOptions;
  #userState: UserState;
  #user?: SessionUser;

  constructor(
    flowOptions: Partial<FlowOptions>,
    passkeysSupported: boolean,
    passkeyAppendInterval: number,
    corbadoApp: CorbadoApp,
    i18next: i18n,
  ) {
    //TODO: Remove defaultOptions once BE has added support for flow options
    this.#flowOptions = {
      ...defaultFlowOptions,
      ...flowOptions,
    };
    this.#userState = defaultUserState;
    this.#passkeysSupported = passkeysSupported;
    this.#corbadoApp = corbadoApp;
    this.#i18next = i18next;
    this.#hasPasskeyAppendIntervalPassed = this.#checkPasskeyAppendIntervalPassed(passkeyAppendInterval);

    corbadoApp.authService.userChanges.subscribe(user => {
      this.update({ user });
    });
  }

  get user(): SessionUser | undefined {
    return this.#user;
  }
  get userState(): UserState {
    return this.#userState;
  }
  get flowOptions(): FlowOptions {
    return this.#flowOptions;
  }

  get passkeysSupported(): boolean {
    return this.#passkeysSupported;
  }

  get corbadoApp(): CorbadoApp {
    return this.#corbadoApp;
  }

  get shouldAppendPasskey(): boolean {
    return this.#passkeysSupported && this.#flowOptions.passkeyAppend && this.#hasPasskeyAppendIntervalPassed;
  }

  /**
   * Allows to update the internal state of the FlowHandler User.
   * @param update
   */
  update(update: FlowHandlerStateUpdate) {
    const newState = update.userState || { ...this.#userState, ...defaultErrors };
    this.#userState = this.#withTranslation(newState);
    this.#user = update.user || this.#user;

    this.#flowOptions = {
      ...this.#flowOptions,
      ...update.flowOptions,
    };
  }

  /**
   * Here we translate the error messages. This is a very simple implementation, but it should be enough for now.
   * @param userState
   */
  #withTranslation(userState: UserState): UserState {
    if (userState.emailError) {
      userState.emailError.translatedMessage = this.#i18next.t(userState.emailError.name);
    }

    if (userState.userNameError) {
      userState.userNameError.translatedMessage = this.#i18next.t(userState.userNameError.name);
    }

    if (userState.verificationError) {
      userState.verificationError.translatedMessage = this.#i18next.t(userState.verificationError.name);
    }

    return userState;
  }

  #checkPasskeyAppendIntervalPassed(interval: number) {
    const lastShownTS = localStorage.getItem(passkeyAppendAskTSKey);

    if (!(lastShownTS && interval)) {
      return true;
    }

    const lastShownDate = new Date(lastShownTS);
    const today = new Date();
    const diffInTimeStamp = today.getTime() - lastShownDate.getTime();
    const diffInDays = Math.ceil(diffInTimeStamp / (1000 * 3600 * 24));

    return diffInDays > interval;
  }
}
