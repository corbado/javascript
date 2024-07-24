import copyIconSrc from '@corbado/shared-ui/assets/copy.svg';
import type { FC } from 'react';
import { useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export interface CopyIconProps extends IconProps {
  color?: 'primary' | 'secondary';
}

export const CopyIcon: FC<CopyIconProps> = ({ color, ...props }) => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(
    svgRef,
    copyIconSrc,
    color === 'secondary' ? '--cb-text-secondary-color' : '--cb-text-primary-color',
  );

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='copy-icon'
      {...props}
    />
  );
};
