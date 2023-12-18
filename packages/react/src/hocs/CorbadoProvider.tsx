import { CorbadoProvider as CorbadoSDKProvider } from '@corbado/react-sdk';
import type { CorbadoAppParams, CorbadoUIConfig } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import CorbadoUIProvider from '../contexts/CorbadoUIProvider';

export type CorbadoProviderProps = PropsWithChildren<CorbadoUIConfig & CorbadoAppParams>;

const CorbadoProvider: FC<CorbadoProviderProps> = ({ children, ...config }) => {
  return (
    <CorbadoUIProvider {...config}>
      <CorbadoSDKProvider {...config}>{children}</CorbadoSDKProvider>
    </CorbadoUIProvider>
  );
};
export default CorbadoProvider;
