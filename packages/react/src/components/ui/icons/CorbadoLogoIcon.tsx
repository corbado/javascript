import corbadoLogoSrc from '@corbado/shared-ui/assets/logo.svg';
import type { FC } from 'react';
import React from 'react';

import type { IconProps } from './Icons';

export const CorbadoLogoIcon: FC<IconProps> = ({ style, className, onClick }) => {
  return (
    <svg>
      <use
        href={corbadoLogoSrc}
        style={style}
        className={className}
        onClick={onClick}
      ></use>
    </svg>
  );
};
