import { CorbadoConnectLogin } from '@corbado/connect-react';
import type { CorbadoConnectLoginConfig } from '@corbado/types';
import type { FC } from 'react';
import type { Root } from 'react-dom/client';

import { mountComponent, unmountComponent } from '../ui/mountConnectComponent';

export class Corbado {
  #componentInstances: Map<HTMLElement, Root> = new Map();

  mountCorbadoConnectLogin(element: HTMLElement, options: CorbadoConnectLoginConfig) {
    this.#mountConnectComponent(element, CorbadoConnectLogin, options);
  }

  unmountCorbadoConnectLogin(element: HTMLElement) {
    this.#unmountConnectComponent(element);
  }

  #mountConnectComponent = <T extends Record<string, any>>(
    element: HTMLElement,
    Component: FC<T>,
    componentOptions: T,
  ) => {
    this.#unmountConnectComponent(element);

    const root = mountComponent(element, Component, componentOptions);

    this.#componentInstances.set(element, root);
  };

  #unmountConnectComponent = (element: HTMLElement) => {
    const existingRoot = this.#componentInstances.get(element);
    if (existingRoot) {
      unmountComponent(existingRoot);
    }
  };
}
