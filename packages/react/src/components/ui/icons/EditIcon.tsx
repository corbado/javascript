import type { FC } from 'react';
import React, { useRef } from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import editSrc from '../../../shared-ui/assets/edit.svg';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export interface EditIconProps extends IconProps {
  color?: 'primary' | 'secondary';
}

export const EditIcon: FC<EditIconProps> = ({ color, ...props }) => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(
    svgRef,
    editSrc,
    color === 'secondary' ? '--cb-text-secondary-color' : '--cb-text-primary-color',
  );

  return (
    <Icon
      src={logoSVG}
      alt='edit-icon'
      ref={svgRef}
      {...props}
    />
  );
};
