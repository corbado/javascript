import type { CorbadoProviderProps } from '@corbado/react';
import { CorbadoApp } from '@corbado/web-core';

import type { CorbadoConfig } from '../types/core';

export class CorbadoAppState {
  #corbadoProviderProps: CorbadoProviderProps;

  constructor(corbadoAppProps: CorbadoConfig) {
    this.#corbadoProviderProps = corbadoAppProps;
    const corbadoApp = new CorbadoApp(corbadoAppProps);
    this.#corbadoProviderProps.corbadoAppInstance = corbadoApp;

    corbadoApp.authService.shortSessionChanges.subscribe(value => {
      this.#corbadoProviderProps.initialShortSession = value;
    });

    corbadoApp.authService.userChanges.subscribe(value => {
      this.#corbadoProviderProps.initialUser = value;
    });

    corbadoApp.globalErrors.subscribe(value => {
      this.#corbadoProviderProps.initialGlobalError = value;

      if (corbadoAppProps.onError && value) {
        corbadoAppProps.onError(value);
      }
    });

    corbadoApp.init();
  }

  get corbadoProviderProps() {
    return this.#corbadoProviderProps;
  }

  get corbadoApp() {
    return this.#corbadoProviderProps.corbadoAppInstance;
  }

  get shortSession() {
    return this.#corbadoProviderProps.initialShortSession;
  }

  get user() {
    return this.#corbadoProviderProps.initialUser;
  }

  get globalError() {
    return this.#corbadoProviderProps.initialGlobalError;
  }

  logout() {
    if (!this.corbadoApp) {
      throw new Error('Please call load() before logging out');
    }

    this.corbadoApp.authService.logout();
    this.#corbadoProviderProps.initialUser = undefined;
    this.#corbadoProviderProps.initialShortSession = undefined;
  }
}
