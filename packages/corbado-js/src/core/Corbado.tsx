import type { CorbadoProviderProps } from '@corbado/react';
import { CorbadoAuth, CorbadoProvider } from '@corbado/react';
import type { CorbadoAuthConfig } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';

export class Corbado {
  #corbadoProps: CorbadoProviderProps | null = null;

  load(options: CorbadoProviderProps) {
    this.#corbadoProps = options;
  }

  mountAuthUI(element: HTMLElement, options: CorbadoAuthConfig) {
    if (!this.#corbadoProps) {
      throw new Error('Corbado is not loaded');
    }

    const AuthUI: FC<{ ProviderProps: CorbadoProviderProps; AuthProps: CorbadoAuthConfig }> = ({
      ProviderProps,
      AuthProps,
    }) => {
      return (
        <CorbadoProvider {...ProviderProps}>
          <CorbadoAuth {...AuthProps} />
        </CorbadoProvider>
      );
    };

    const root = createRoot(element);
    root.render(
      <AuthUI
        ProviderProps={this.#corbadoProps}
        AuthProps={options}
      />,
    );
  }
}
