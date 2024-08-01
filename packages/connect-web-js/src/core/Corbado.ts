import { CorbadoConnectAppend, CorbadoConnectLogin, CorbadoConnectPasskeyList } from '@corbado/connect-react';
import type {
  CorbadoConnectAppendConfig,
  CorbadoConnectConfig,
  CorbadoConnectLoginConfig,
  CorbadoConnectPasskeyListConfig,
} from '@corbado/types';
import type { FC } from 'react';
import type { Root } from 'react-dom/client';

import { CorbadoState } from '../models/CorbadoState';
import { mountComponent, unmountComponent } from '../ui/mountConnectComponent';

export class Corbado {
  #corbadoState?: CorbadoState;
  #componentInstances: Map<HTMLElement, Root> = new Map();

  load(options: CorbadoConnectConfig) {
    this.#corbadoState = new CorbadoState(options);
  }

  clone() {
    return new Corbado();
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

  mountCorbadoConnectPasskeyList(element: HTMLElement, options: CorbadoConnectPasskeyListConfig) {
    this.#mountConnectComponent(element, CorbadoConnectPasskeyList, options);
  }

  unmountCorbadoConnectPasskeyList(element: HTMLElement) {
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
