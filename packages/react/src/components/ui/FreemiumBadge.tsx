import type { FC } from 'react';
import React from 'react';

import { CorbadoLogoIcon } from './icons/Icons';

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
          color: 'var(--cb-white)',
          fontFamily: 'var(--cb-font)',
          fontSize: '0.6rem',
          fontWeight: 700,
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
