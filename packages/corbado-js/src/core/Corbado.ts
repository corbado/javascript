import type { CorbadoProviderProps } from '@corbado/react';
import { CorbadoAuth, PasskeyList } from '@corbado/react';
import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';

import { CorbadoAppState } from '../models/CorbadoAppState';
import { mountComponent } from '../utils/mountComponent';

export class Corbado {
  #corbadoAppState?: CorbadoAppState;

  get user() {
    return this.#corbadoAppState?.user;
  }

  get shortSession() {
    return this.#corbadoAppState?.shortSession;
  }

  load(options: CorbadoProviderProps) {
    this.#corbadoAppState = new CorbadoAppState(options);
  }

  mountAuthUI(element: HTMLElement, options: CorbadoAuthConfig) {
    this.#mountComponent(element, CorbadoAuth, options);
  }

  mountPasskeyListUI(element: HTMLElement) {
    this.#mountComponent(element, PasskeyList, {});
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #mountComponent = <T extends Record<string, any>>(element: HTMLElement, Component: FC<T>, componentOptions: T) => {
    if (!this.#corbadoAppState) {
      throw new Error('Please call load() before mounting components');
    }

    mountComponent(this.#corbadoAppState, element, Component, componentOptions);
  };
}