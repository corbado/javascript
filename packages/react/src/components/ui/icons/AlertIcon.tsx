import alertSrc from '@corbado/shared-ui/assets/alert.svg';
import type { FC } from 'react';
import { useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export interface AlertIconProps extends IconProps {
  color?: 'primary' | 'secondary' | 'error';
}

export const AlertIcon: FC<AlertIconProps> = ({ color, ...props }) => {
  const svgRef = useRef<HTMLImageElement>(null);

  const getColor = () => {
    switch (color) {
      case 'secondary':
        return '--cb-text-primary-color';
      case 'error':
        return '--cb-error-text-color';
      default:
        return '--cb-button-text-primary';
    }
  };

  const { logoSVG } = useIconWithTheme(svgRef, alertSrc, getColor());

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='alert'
      {...props}
    />
  );
};
