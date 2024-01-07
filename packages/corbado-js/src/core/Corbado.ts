import { CorbadoAuth, PasskeyList } from '@corbado/react';
import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';

import { CorbadoAppState } from '../models/CorbadoAppState';
import type { CorbadoConfig } from '../types/core';
import { mountComponent } from '../ui/mountComponent';

export class Corbado {
  #corbadoAppState?: CorbadoAppState;

  get user() {
    return this.#corbadoAppState?.user;
  }

  get shortSession() {
    return this.#corbadoAppState?.shortSession;
  }

  load(options: CorbadoConfig) {
    this.#corbadoAppState = new CorbadoAppState(options);
  }

  mountAuthUI(element: HTMLElement, options: CorbadoAuthConfig) {
    this.#mountComponent(element, CorbadoAuth, options);
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
}
