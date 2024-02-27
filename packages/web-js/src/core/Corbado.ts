import { CorbadoAuth, Login, PasskeyList, SignUp } from '@corbado/react';
import type { CorbadoAuthConfig, CorbadoLoginConfig, CorbadoSignUpConfig } from '@corbado/types';
import type { FC } from 'react';

import { CorbadoAppState } from '../models/CorbadoAppState';
import type { CorbadoConfig } from '../types/core';
import { mountComponent, unmountComponent } from '../ui/mountComponent';

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

  get isAuthenticated() {
    return this.#getCorbadoAppState().isAuthenticated;
  }

  get authStateChanges() {
    return this.#getCorbadoAppState().authStateChanges;
  }

  async load(options: CorbadoConfig) {
    const corbadoAppState = new CorbadoAppState(options);
    await corbadoAppState.init();

    this.#corbadoAppState = corbadoAppState;
  }

  mountAuthUI(element: HTMLElement, options: CorbadoAuthConfig) {
    this.#corbadoAppState?.clearGlobalError();
    this.#mountComponent(element, CorbadoAuth, options);
  }

  unmountAuthUI(element: HTMLElement) {
    this.#unmountComponent(element);
  }

  mountSignUpUI(element: HTMLElement, options: CorbadoSignUpConfig) {
    this.#corbadoAppState?.clearGlobalError();
    this.#mountComponent(element, SignUp, options);
  }

  unmountSignUpUI(element: HTMLElement) {
    this.#unmountComponent(element);
  }

  mountLoginUI(element: HTMLElement, options: CorbadoLoginConfig) {
    this.#corbadoAppState?.clearGlobalError();
    this.#mountComponent(element, Login, options);
  }

  unmountLoginUI(element: HTMLElement) {
    this.#unmountComponent(element);
  }

  mountPasskeyListUI(element: HTMLElement) {
    this.#corbadoAppState?.clearGlobalError();
    this.#mountComponent(element, PasskeyList, {});
  }

  unmountPasskeyListUI(element: HTMLElement) {
    this.#unmountComponent(element);
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

  #unmountComponent = (element: HTMLElement) => {
    if (!this.#corbadoAppState) {
      throw new Error('Please call load() before unmounting components');
    }

    unmountComponent(element);
  };

  #getCorbadoAppState = (): CorbadoAppState => {
    if (!this.#corbadoAppState) {
      throw new Error('Please call load() before using this library');
    }

    return this.#corbadoAppState;
  };
}
