import type { FC, PropsWithChildren, ReactNode } from 'react';
import React, { memo } from 'react';

import useFlowHandler from '../../hooks/useFlowHandler';
import { Body, EmailProviderButtons, Header } from '../ui';

export interface EmailScreenBaseProps {
  header: ReactNode;
  body?: ReactNode;
}

export const EmailScreenBase: FC<PropsWithChildren<EmailScreenBaseProps>> = memo(({ header, body, children }) => {
  const { currentUserState } = useFlowHandler();

  return (
    <>
      <Header>{header}</Header>

      <Body>{body}</Body>

      <EmailProviderButtons />

      {children}

      {currentUserState.verificationError && (
        <p className='cb-error'>{currentUserState.verificationError.translatedMessage}</p>
      )}
    </>
  );
});
