'use client';

import React from 'react';
import { CorbadoConnectProvider } from '@corbado/connect-react';
import { configureAmplify } from '@/lib/amplify-config';

configureAmplify();

const WrappedCorbadoConnectProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CorbadoConnectProvider
      projectId={process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!}
      frontendApiUrlSuffix={process.env.NEXT_PUBLIC_CORBADO_FRONTEND_API_URL_SUFFIX}
      isDebug={true}
    >
      {children}
    </CorbadoConnectProvider>
  );
};

export default WrappedCorbadoConnectProvider;
