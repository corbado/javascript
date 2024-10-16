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
  #componentInstances: Map<HTMLElement, Root> = new Map();

  mountCorbadoConnectLogin(element: HTMLElement, options: CorbadoConnectLoginConfig & CorbadoConnectConfig) {
    this.#mountConnectComponent(element, CorbadoConnectLogin, options);
  }

  unmountCorbadoConnectLogin(element: HTMLElement) {
    this.#unmountConnectComponent(element);
  }

  mountCorbadoConnectAppend(element: HTMLElement, options: CorbadoConnectAppendConfig & CorbadoConnectConfig) {
    this.#mountConnectComponent(element, CorbadoConnectAppend, options);
  }

  unmountCorbadoConnectAppend(element: HTMLElement) {
    this.#unmountConnectComponent(element);
  }

  mountCorbadoConnectPasskeyList(
    element: HTMLElement,
    options: CorbadoConnectPasskeyListConfig & CorbadoConnectConfig,
  ) {
    this.#mountConnectComponent(element, CorbadoConnectPasskeyList, options);
  }

  unmountCorbadoConnectPasskeyList(element: HTMLElement) {
    this.#unmountConnectComponent(element);
  }

  #mountConnectComponent = <T extends Record<string, any>>(
    element: HTMLElement,
    Component: FC<T & CorbadoConnectConfig>,
    componentOptions: T & CorbadoConnectConfig,
  ) => {
    const corbadoState = new CorbadoState(componentOptions);

    this.#unmountConnectComponent(element);

    const root = mountComponent(corbadoState, element, Component, componentOptions);

    this.#componentInstances.set(element, root);
  };

  #unmountConnectComponent = (element: HTMLElement) => {
    const existingRoot = this.#componentInstances.get(element);
    if (existingRoot) {
      unmountComponent(existingRoot);
    }
  };
}
