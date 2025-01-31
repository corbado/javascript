import type { SessionUser } from '@corbado/types';
import type { NonRecoverableError } from '@corbado/web-core';
import { CorbadoApp } from '@corbado/web-core';

import type { CorbadoConfig } from '../types/core';

export class CorbadoAppState {
  #corbadoApp: CorbadoApp;
  #corbadoAppProps: CorbadoConfig;
  #sessionToken?: string;
  #isAuthenticated?: boolean;
  #user?: SessionUser;
  #globalError?: NonRecoverableError;

  constructor(corbadoAppProps: CorbadoConfig) {
    const corbadoApp = new CorbadoApp(corbadoAppProps);

    corbadoApp.sessionService.sessionTokenChanges.subscribe(value => {
      this.#sessionToken = value;
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

  get sessionToken() {
    return this.#sessionToken;
  }

  get sessionTokenChanges() {
    return this.#corbadoApp.sessionService.sessionTokenChanges;
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
