import type { CorbadoConnectProviderProps } from '@corbado/connect-react';
import { CorbadoConnectModal, CorbadoConnectProvider } from '@corbado/connect-react';
import type { FC } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import '@corbado/connect-react/src/index.css';

import type { CorbadoState } from '../models/CorbadoState'; // eslint-disable-next-line @typescript-eslint/no-explicit-any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mountShadowDom(element: HTMLElement, customStyles?: string) {
  const reactEntry = document.createElement('div');
  const cboStyles = process.env.CBO_STYLES;
  const defaultStylesElement = document.createElement('style');
  if (!cboStyles) {
    throw new Error('CBO_STYLES is not defined');
  }

  defaultStylesElement.innerHTML = cboStyles;

  const shadow = element.attachShadow({ mode: 'open' });
  shadow.appendChild(defaultStylesElement);

  if (customStyles) {
    const customStylesElement = document.createElement('link');
    customStylesElement.setAttribute('rel', 'stylesheet');
    customStylesElement.setAttribute('href', customStyles);
    shadow.appendChild(customStylesElement);
  }
  shadow.appendChild(reactEntry);

  return { shadow, reactEntry };
}

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
