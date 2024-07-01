import { CorbadoConnectAppend, CorbadoConnectLogin } from '@corbado/connect-react';
import type { CorbadoConnectAppendConfig, CorbadoConnectConfig, CorbadoConnectLoginConfig } from '@corbado/types';
import type { FC } from 'react';
import type { Root } from 'react-dom/client';

import { mountComponent, unmountComponent } from '../ui/mountConnectComponent';
import { CorbadoState } from '../models/CorbadoState';

export class Corbado {
  #corbadoState?: CorbadoState;
  #componentInstances: Map<HTMLElement, Root> = new Map();

  load(options: CorbadoConnectConfig) {
    this.#corbadoState = new CorbadoState(options);
  }

  mountCorbadoConnectLogin(element: HTMLElement, options: CorbadoConnectLoginConfig) {
    this.#mountConnectComponent(element, CorbadoConnectLogin, options);
  }

  unmountCorbadoConnectLogin(element: HTMLElement) {
    this.#unmountConnectComponent(element);
  }

  mountCorbadoConnectAppend(element: HTMLElement, options: CorbadoConnectAppendConfig) {
    this.#mountConnectComponent(element, CorbadoConnectAppend, options);
  }

  unmountCorbadoConnectAppend(element: HTMLElement) {
    this.#unmountConnectComponent(element);
  }

  #mountConnectComponent = <T extends Record<string, any>>(
    element: HTMLElement,
    Component: FC<T>,
    componentOptions: T,
  ) => {
    this.#unmountConnectComponent(element);
    if (!this.#corbadoState) {
      throw new Error('Please call load() before mounting components');
    }

    this.#unmountConnectComponent(element);

    const root = mountComponent(this.#corbadoState, element, Component, componentOptions);

    this.#componentInstances.set(element, root);
  };

  #unmountConnectComponent = (element: HTMLElement) => {
    const existingRoot = this.#componentInstances.get(element);
    if (existingRoot) {
      unmountComponent(existingRoot);
    }
  };
}
