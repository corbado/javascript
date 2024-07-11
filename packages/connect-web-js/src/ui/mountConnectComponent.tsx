import type { CorbadoConnectProviderProps } from '@corbado/connect-react';
import { CorbadoConnectProvider, CorbadoConnectModal } from '@corbado/connect-react';
import type { FC } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';

import type { CorbadoState } from '../models/CorbadoState';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mountComponent<T extends Record<string, any>>(
  corbadoState: CorbadoState,
  element: HTMLElement,
  Component: FC<T>,
  componentOptions: T,
) {
  const ComponentWithContext: FC<{ providerProps: CorbadoConnectProviderProps; componentProps: T }> = ({
    providerProps,
    componentProps,
  }) => {
    return (
      <CorbadoConnectProvider
        {...providerProps}
        isWebJs
      >
        {ReactDOM.createPortal(<CorbadoConnectModal />, document.body)}
        <Component {...componentProps} />
      </CorbadoConnectProvider>
    );
  };

  const root = createRoot(element);
  const providerProps: CorbadoConnectProviderProps = {
    connectService: corbadoState.connectService,
    ...corbadoState.connectConfig,
  };

  root.render(
    <ComponentWithContext
      providerProps={providerProps}
      componentProps={componentOptions}
    />,
  );

  return root;
}

export function unmountComponent(root: Root) {
  root.unmount();
}
