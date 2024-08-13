import addSrc from '@corbado/shared-ui/assets/add.svg';
import type { FC } from 'react';
import { useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export interface AddIconProps extends IconProps {
  color?: 'primary' | 'secondary';
}

export const AddIcon: FC<AddIconProps> = ({ color, ...props }) => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(
    svgRef,
    addSrc,
    color === 'secondary' ? '--cb-text-primary-color' : '--cb-button-text-primary-color',
  );

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='add'
      {...props}
    />
  );
};
