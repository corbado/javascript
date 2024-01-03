import type { CorbadoProviderProps } from '@corbado/react';
import { CorbadoAuth, CorbadoProvider } from '@corbado/react';
import type { CorbadoAuthConfig } from '@corbado/types';
import React from 'react';
import ReactDOM from 'react-dom';

export class Corbado {
  #corbadoProps: CorbadoProviderProps | null = null;

  load(options: CorbadoProviderProps) {
    this.#corbadoProps = options;
  }

  mountAuthUI(element: HTMLElement, options: CorbadoAuthConfig) {
    if (!this.#corbadoProps) {
      throw new Error('Corbado is not loaded');
    }

    ReactDOM.render(
      <CorbadoProvider {...this.#corbadoProps}>
        <CorbadoAuth {...options} />
      </CorbadoProvider>,
      element,
    );
  }
}
