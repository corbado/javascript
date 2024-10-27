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
import { mountComponent, mountShadowDom, unmountComponent } from '../ui/mountConnectComponent';

export class Corbado {
  #componentInstances: Map<HTMLElement, Root> = new Map();
  #shadowDomInstances: Map<HTMLElement, { shadow: ShadowRoot; reactEntry: HTMLElement }> = new Map();

  mountCorbadoConnectLogin(
    element: HTMLElement,
    options: CorbadoConnectLoginConfig & CorbadoConnectConfig,
    customStyles?: string,
  ) {
    this.#mountConnectComponent(element, CorbadoConnectLogin, options, customStyles);
  }

  unmountCorbadoConnectLogin(element: HTMLElement) {
    this.#unmountConnectComponent(element);
  }

  mountCorbadoConnectAppend(
    element: HTMLElement,
    options: CorbadoConnectAppendConfig & CorbadoConnectConfig,
    customStyles?: string,
  ) {
    this.#mountConnectComponent(element, CorbadoConnectAppend, options, customStyles);
  }

  unmountCorbadoConnectAppend(element: HTMLElement) {
    this.#unmountConnectComponent(element);
  }

  mountCorbadoConnectPasskeyList(
    element: HTMLElement,
    options: CorbadoConnectPasskeyListConfig & CorbadoConnectConfig,
    customStyles?: string,
  ) {
    this.#mountConnectComponent(element, CorbadoConnectPasskeyList, options, customStyles);
  }

  unmountCorbadoConnectPasskeyList(element: HTMLElement) {
    this.#unmountConnectComponent(element);
  }

  #mountConnectComponent = <T extends Record<string, any>>(
    element: HTMLElement,
    Component: FC<T & CorbadoConnectConfig>,
    componentOptions: T & CorbadoConnectConfig,
    customStyles?: string,
  ) => {
    const corbadoState = new CorbadoState(componentOptions);

    this.#unmountConnectComponent(element);

    let mabyeShadowDomContainer = this.#shadowDomInstances.get(element);
    if (!mabyeShadowDomContainer) {
      mabyeShadowDomContainer = mountShadowDom(element, customStyles);
      this.#shadowDomInstances.set(element, mabyeShadowDomContainer);
    }

    const root = mountComponent(corbadoState, mabyeShadowDomContainer.reactEntry, Component, componentOptions);

    this.#componentInstances.set(element, root);
  };

  #unmountConnectComponent = (element: HTMLElement) => {
    const existingRoot = this.#componentInstances.get(element);
    if (existingRoot) {
      unmountComponent(existingRoot);
    }
  };
}
