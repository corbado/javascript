import type { SessionUser } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';
import { CorbadoApp } from '@corbado/web-core';

import type { CorbadoConfig } from '../types/core';

export class CorbadoAppState {
  #corbadoApp: CorbadoApp;
  #corbadoAppProps: CorbadoConfig;
  #shortSession?: string;
  #user?: SessionUser;
  #globalError?: NonRecoverableError;

  constructor(corbadoAppProps: CorbadoConfig) {
    const corbadoApp = new CorbadoApp(corbadoAppProps);

    corbadoApp.authService.shortSessionChanges.subscribe(value => {
      this.#shortSession = value;
    });

    corbadoApp.authService.userChanges.subscribe(value => {
      this.#user = value;
    });

    corbadoApp.globalErrors.subscribe(value => {
      this.#globalError = value;

      if (corbadoAppProps.onError && value) {
        corbadoAppProps.onError(value);
      }
    });

    corbadoApp.init();
    this.#corbadoApp = corbadoApp;
    this.#corbadoAppProps = corbadoAppProps;
  }

  get corbadoApp() {
    return this.#corbadoApp;
  }

  get corbadoAppProps() {
    return this.#corbadoAppProps;
  }

  get shortSession() {
    return this.#shortSession;
  }

  get shortSessionChanges() {
    return this.#corbadoApp.authService.shortSessionChanges;
  }

  get userChanges() {
    return this.#corbadoApp.authService.userChanges;
  }

  get user() {
    return this.#user;
  }

  get globalError() {
    return this.#globalError;
  }

  logout() {
    if (!this.corbadoApp) {
      throw new Error('Please call load() before logging out');
    }

    this.corbadoApp.authService.logout();
  }
}
