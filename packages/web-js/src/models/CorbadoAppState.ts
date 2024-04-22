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

    corbadoApp.sessionService.shortSessionChanges.subscribe(value => {
      this.#shortSession = value;
    });

    corbadoApp.sessionService.userChanges.subscribe(value => {
      this.#user = value;
    });

    corbadoApp.sessionService.authStateChanges.subscribe(value => {
      this.#isAuthenticated = !!value;
    });

    this.#corbadoApp = corbadoApp;
    this.#corbadoAppProps = corbadoAppProps;
  }

  async init() {
    const res = await this.#corbadoApp.init();
    if (res.err) {
      this.#globalError = res.val;
      return;
    }

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
    return this.#corbadoApp.sessionService.shortSessionChanges;
  }

  get isAuthenticated() {
    return this.#isAuthenticated;
  }

  get authStateChanges() {
    return this.#corbadoApp.sessionService.authStateChanges;
  }

  get userChanges() {
    return this.#corbadoApp.sessionService.userChanges;
  }

  get user() {
    return this.#user;
  }

  get globalError() {
    return this.#globalError;
  }

  logout() {
    return this.corbadoApp.sessionService.logout();
  }
}
