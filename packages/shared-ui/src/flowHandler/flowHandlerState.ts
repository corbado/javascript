import type { SessionUser } from '@corbado/types';
import type { CorbadoApp } from '@corbado/web-core';
import type { i18n } from 'i18next';

import type { FlowHandlerStateUpdate, FlowOptions, UserState } from './types';

const defaultErrors = {
  emailError: undefined,
  userNameError: undefined,
  emailOTPError: undefined,
};

/**
 * Internal state of the FlowHandler.
 */
export class FlowHandlerState {
  #flowOptions: FlowOptions;
  #userState: UserState;
  #passkeysSupported: boolean;
  #user?: SessionUser;
  #corbadoApp: CorbadoApp;
  #i18next: i18n;

  constructor(
    flowOptions: FlowOptions,
    userState: UserState,
    passkeysSupported: boolean,
    corbadoApp: CorbadoApp,
    i18next: i18n,
  ) {
    this.#flowOptions = flowOptions;
    this.#userState = userState;
    this.#passkeysSupported = passkeysSupported;
    this.#corbadoApp = corbadoApp;
    this.#i18next = i18next;
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
   * Allows to update the internal state of the FlowHandler.
   * @param update
   */
  update(update: FlowHandlerStateUpdate) {
    const newState = update.userState || defaultErrors || this.#userState;
    this.#userState = this.withTranslation(newState);
    this.#user = update.user || this.#user;
  }

  /**
   * Here we translate the error messages. This is a very simple implementation, but it should be enough for now.
   * @param userState
   */
  withTranslation(userState: UserState): UserState {
    if (userState.emailError) {
      userState.emailError.translatedMessage = this.#i18next.t(userState.emailError.name);
    }

    if (userState.userNameError) {
      userState.userNameError.translatedMessage = this.#i18next.t(userState.userNameError.name);
    }

    if (userState.emailOTPError) {
      userState.emailOTPError.translatedMessage = this.#i18next.t(userState.emailOTPError.name);
    }

    return userState;
  }
}