import type { CorbadoProviderProps } from '@corbado/react';
import { CorbadoApp } from '@corbado/web-core';

export class CorbadoAppState {
  #corbadoProviderProps: CorbadoProviderProps;

  constructor(corbadoAppProps: CorbadoProviderProps) {
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
    });
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
}
