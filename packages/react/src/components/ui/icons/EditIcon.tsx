import editSrc from '@corbado/shared-ui/assets/edit.svg';
import type { FC } from 'react';
import React, { useRef } from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export interface EditIconProp extends IconProps {
  color?: 'primary' | 'secondary';
}

export const EditIcon: FC<EditIconProp> = ({ color, ...props }) => {
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
