import { CorbadoAuth, Login, PasskeyList, SignUp } from '@corbado/react';
import type { CorbadoAuthConfig, CorbadoLoginConfig, CorbadoSignUpConfig } from '@corbado/types';
import type { FC } from 'react';

import { CorbadoAppState } from '../models/CorbadoAppState';
import type { CorbadoConfig } from '../types/core';
import { mountComponent } from '../ui/mountComponent';

export class Corbado {
  #corbadoAppState?: CorbadoAppState;

  get user() {
    return this.#getCorbadoAppState().user;
  }

  get shortSession() {
    return this.#getCorbadoAppState().shortSession;
  }

  get shortSessionChanges() {
    return this.#getCorbadoAppState().shortSessionChanges;
  }

  get userChanges() {
    return this.#getCorbadoAppState().userChanges;
  }

  load(options: CorbadoConfig) {
    this.#corbadoAppState = new CorbadoAppState(options);
  }

  mountAuthUI(element: HTMLElement, options: CorbadoAuthConfig) {
    this.#mountComponent(element, CorbadoAuth, options);
  }

  mountSignUpUI(element: HTMLElement, options: CorbadoSignUpConfig) {
    this.#mountComponent(element, SignUp, options);
  }

  mountLoginUI(element: HTMLElement, options: CorbadoLoginConfig) {
    this.#mountComponent(element, Login, options);
  }

  mountPasskeyListUI(element: HTMLElement) {
    this.#mountComponent(element, PasskeyList, {});
  }

  logout() {
    if (!this.#corbadoAppState) {
      throw new Error('Please call load() before logging out');
    }

    this.#corbadoAppState.logout();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #mountComponent = <T extends Record<string, any>>(element: HTMLElement, Component: FC<T>, componentOptions: T) => {
    if (!this.#corbadoAppState) {
      throw new Error('Please call load() before mounting components');
    }

    mountComponent(this.#corbadoAppState, element, Component, componentOptions);
  };

  #getCorbadoAppState = (): CorbadoAppState => {
    if (!this.#corbadoAppState) {
      throw new Error('Please call load() before using this library');
    }

    return this.#corbadoAppState;
  };
}
