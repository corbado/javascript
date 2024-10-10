import { CorbadoAuth, Login, PasskeyList, SignUp, UserDetails } from '@corbado/react';
import type { CorbadoAuthConfig, CorbadoLoginConfig, CorbadoSignUpConfig, LoginIdentifierType } from '@corbado/types';
import type { FC } from 'react';
import type { Root } from 'react-dom/client';

import { CorbadoAppState } from '../models/CorbadoAppState';
import type { CorbadoConfig } from '../types/core';
import { mountComponent, unmountComponent } from '../ui/mountComponent';

export class Corbado {
  #corbadoAppState?: CorbadoAppState;
  #componentInstances: Map<HTMLElement, Root> = new Map();

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
    this.#mountComponent(element, CorbadoAuth, options);
  }

  unmountAuthUI(element: HTMLElement) {
    this.#unmountComponent(element);
  }

  mountSignUpUI(element: HTMLElement, options: CorbadoSignUpConfig) {
    this.#mountComponent(element, SignUp, options);
  }

  unmountSignUpUI(element: HTMLElement) {
    this.#unmountComponent(element);
  }

  mountLoginUI(element: HTMLElement, options: CorbadoLoginConfig) {
    this.#mountComponent(element, Login, options);
  }

  unmountLoginUI(element: HTMLElement) {
    this.#unmountComponent(element);
  }

  mountPasskeyListUI(element: HTMLElement) {
    this.#mountComponent(element, PasskeyList, {});
  }

  unmountPasskeyListUI(element: HTMLElement) {
    this.#unmountComponent(element);
  }

  mountUserDetailsUI(element: HTMLElement) {
    this.#mountComponent(element, UserDetails, {});
  }

  unmountUserDetailsUI(element: HTMLElement) {
    this.#unmountComponent(element);
  }

  logout() {
    if (!this.#corbadoAppState) {
      throw new Error('Please call load() before logging out');
    }

    return this.#corbadoAppState.logout();
  }

  getPasskeys(abortController?: AbortController) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.passkeyList(abortController ?? new AbortController());
  }

  appendPasskey() {
    return this.#getCorbadoAppState().corbadoApp.sessionService.appendPasskey();
  }

  deletePasskey(id: string) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.passkeyDelete(id);
  }

  getFullUser(abortController?: AbortController) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.getFullUser(abortController ?? new AbortController());
  }

  getUserDetailsConfig(abortController?: AbortController) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.getUserDetailsConfig(
      abortController ?? new AbortController(),
    );
  }

  updateFullName(fullName: string) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.updateFullName(fullName);
  }

  updateUsername(identifierId: string, username: string) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.updateUsername(identifierId, username);
  }

  createIdentifier(identifierType: LoginIdentifierType, value: string) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.createIdentifier(identifierType, value);
  }

  deleteIdentifier(identifierId: string) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.deleteIdentifier(identifierId);
  }

  verifyIdentifierStart(identifierId: string) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.verifyIdentifierStart(identifierId);
  }

  verifyIdentifierFinish(identifierId: string, code: string) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.verifyIdentifierFinish(identifierId, code);
  }

  makePrimary(identifierId: string, identifierType: LoginIdentifierType) {
    return this.#getCorbadoAppState().corbadoApp.sessionService.makePrimary(identifierId, identifierType);
  }

  deleteUser() {
    return this.#getCorbadoAppState().corbadoApp.sessionService.deleteUser();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #mountComponent = <T extends Record<string, any>>(element: HTMLElement, Component: FC<T>, componentOptions: T) => {
    if (!this.#corbadoAppState) {
      throw new Error('Please call load() before mounting components');
    }

    this.#unmountComponent(element);

    const root = mountComponent(this.#corbadoAppState, element, Component, componentOptions);

    this.#componentInstances.set(element, root);
  };

  #unmountComponent = (element: HTMLElement) => {
    if (!this.#corbadoAppState) {
      throw new Error('Please call load() before unmounting components');
    }

    const existingRoot = this.#componentInstances.get(element);
    if (existingRoot) {
      unmountComponent(existingRoot);
    }
  };

  #getCorbadoAppState = (): CorbadoAppState => {
    if (!this.#corbadoAppState) {
      throw new Error('Please call load() before using this library');
    }

    return this.#corbadoAppState;
  };
}
