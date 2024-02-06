import type { FC } from 'react';
import React from 'react';

import { CorbadoLogoIcon } from './icons/Icons';

export const FreemiumBadge: FC = () => {
  return (
    <div
      style={{
        backgroundColor: 'var(--cb-primary-color)',
        borderRadius: ' 0 0 2.2rem 2.2rem',
        height: '2.5rem',
        width: '13.5rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          color: '#ffffff',
          fontFamily: 'var(--cb-font)',
          fontSize: '0.8rem',
          fontWeight: 500,
          letterSpacing: '0.03rem',
        }}
      >
        Secured by
      </div>
      <CorbadoLogoIcon
        style={{
          height: '1.4rem',
          paddingLeft: '0.4rem',
        }}
      />
    </div>
  );
};
