import type { CorbadoProviderProps } from '@corbado/react';
import { CorbadoProvider } from '@corbado/react';
import type { FC } from 'react';
import React from 'react';
import { createRoot } from 'react-dom/client';

import type { CorbadoAppState } from '../models/CorbadoAppState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mountComponent<T extends Record<string, any>>(
  corbadoAppState: CorbadoAppState,
  element: HTMLElement,
  Component: FC<T>,
  componentOptions: T,
) {
  const ComponentWithContext: FC<{ providerProps: CorbadoProviderProps; componentProps: T }> = ({
    providerProps,
    componentProps,
  }) => {
    return (
      <CorbadoProvider {...providerProps}>
        <Component {...componentProps} />
      </CorbadoProvider>
    );
  };

  const root = createRoot(element);
  root.render(
    <ComponentWithContext
      providerProps={{ corbadoAppInstance: corbadoAppState.corbadoApp, ...corbadoAppState.corbadoAppProps }}
      componentProps={componentOptions}
    />,
  );
}
