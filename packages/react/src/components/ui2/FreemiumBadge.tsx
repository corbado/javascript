import { InitState } from '@corbado/shared-ui';
import type { FC } from 'react';
import React from 'react';

import useFlowHandler from '../../hooks/useFlowHandler';
import { CorbadoLogoIcon } from './icons/LogoIcon';

export const FreemiumBadge: FC = () => {
  const { initState } = useFlowHandler();

  if (initState === InitState.Initializing) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--cb-primary-color)',
        borderRadius: ' 0 0 1rem 1rem',
        height: '2rem',
        width: '11rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          color: 'var(--cb-button-text-primary-color)',
          fontFamily: 'var(--cb-primary-font)',
          fontSize: '0.6rem',
          fontWeight: 700,
          letterSpacing: '0.03rem',
        }}
      >
        Secured by
      </div>
      <a
        href='https://www.corbado.com'
        target='_blank'
        rel='noreferrer'
        style={{
          display: 'flex',
        }}
      >
        <CorbadoLogoIcon
          style={{
            height: '1.1rem',
            paddingLeft: '0.4rem',
          }}
        />
      </a>
    </div>
  );
};
