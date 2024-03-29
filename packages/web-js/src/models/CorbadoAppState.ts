import type { SessionUser } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';
import { CorbadoApp } from '@corbado/web-core';

import type { CorbadoConfig } from '../types/core';

export class CorbadoAppState {
  #corbadoApp: CorbadoApp;
  #corbadoAppProps: CorbadoConfig;
  #shortSession?: string;
  #isAuthenticated?: boolean;
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

    corbadoApp.authService.authStateChanges.subscribe(value => {
      this.#isAuthenticated = !!value;
    });

    this.#corbadoApp = corbadoApp;
    this.#corbadoAppProps = corbadoAppProps;
  }

  async init() {
    await this.#corbadoApp.init();

    return;
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

  get isAuthenticated() {
    return this.#isAuthenticated;
  }

  get authStateChanges() {
    return this.#corbadoApp.authService.authStateChanges;
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

    return this.corbadoApp.authService.logout();
  }

  clearGlobalError() {
    this.corbadoApp.globalErrors.next(undefined);
  }
}
