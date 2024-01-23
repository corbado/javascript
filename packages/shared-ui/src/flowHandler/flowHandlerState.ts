import type { SessionUser } from '@corbado/types';
import type { CorbadoApp } from '@corbado/web-core';
import type { i18n } from 'i18next';

import type { FlowHandlerStateUpdate, FlowOptions, UserState } from './types';

const defaultErrors: UserState = {
  emailError: undefined,
  userNameError: undefined,
  verificationError: undefined,
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
  #flowOptions: FlowOptions;
  #userState: UserState;
  #passkeysSupported: boolean;
  #user?: SessionUser;
  #corbadoApp: CorbadoApp;
  #i18next: i18n;

  constructor(
    flowOptions: Partial<FlowOptions>,
    userState: UserState,
    passkeysSupported: boolean,
    corbadoApp: CorbadoApp,
    i18next: i18n,
  ) {
    //TODO: Remove defaultOptions once BE has added support for flow options
    this.#flowOptions = {
      ...defaultFlowOptions,
      ...flowOptions,
    };
    this.#userState = userState;
    this.#passkeysSupported = passkeysSupported;
    this.#corbadoApp = corbadoApp;
    this.#i18next = i18next;

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
}
