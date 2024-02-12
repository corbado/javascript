import type { FC } from 'react';
import React from 'react';

import { CorbadoLogoIcon } from './icons/CorbadoLogoIcon';

export const FreemiumBadge: FC = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--cb-primary-color)',
        borderRadius: ' 0 0 1.5rem 1.5rem',
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
          color: 'var(--cb-secondary-text-color)',
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
