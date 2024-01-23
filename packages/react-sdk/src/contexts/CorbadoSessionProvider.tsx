import type { SessionUser } from '@corbado/types';
import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { CorbadoSessionContext } from './CorbadoSessionContext';

type CorbadoSessionProviderParams = PropsWithChildren<{
  loading: boolean;
  shortSession: string | undefined;
  user: SessionUser | undefined;
  isAuthenticated: boolean;
}>;

export const CorbadoSessionProvider: FC<CorbadoSessionProviderParams> = ({
  children,
  loading,
  isAuthenticated,
  shortSession,
  user,
}) => {
  return (
    <CorbadoSessionContext.Provider value={{ shortSession, loading, user, isAuthenticated }}>
      {children}
    </CorbadoSessionContext.Provider>
  );
};
