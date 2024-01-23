import type { FC, PropsWithChildren } from 'react';
import React, { useMemo } from 'react';

import type { ErrorHandlingContextProps } from './ErrorHandlingContext';
import ErrorHandlingContext from './ErrorHandlingContext';

export const ErrorHandlingProvider: FC<PropsWithChildren<ErrorHandlingContextProps>> = ({
  children,
  customerSupportEmail,
  isDevMode,
}) => {
  const contextValue = useMemo<ErrorHandlingContextProps>(
    () => ({
      customerSupportEmail,
      isDevMode,
    }),
    [customerSupportEmail, isDevMode],
  );

  return <ErrorHandlingContext.Provider value={contextValue}>{children}</ErrorHandlingContext.Provider>;
};

export default ErrorHandlingProvider;
