import changeIconSrc from '@corbado/shared-ui/assets/change.svg';
import type { FC } from 'react';
import { useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export interface ChangeIconProps extends IconProps {
  color?: 'primary' | 'secondary';
}

export const ChangeIcon: FC<ChangeIconProps> = ({ color, ...props }) => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(
    svgRef,
    changeIconSrc,
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
