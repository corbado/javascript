import editSrc from '@corbado/shared-ui/assets/edit.svg';
import type { FC } from 'react';
import React, { useRef } from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const EditIcon: FC<IconProps> = props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, editSrc, '--cb-text-secondary-color');

  return (
    <Icon
      src={logoSVG}
      alt='edit-icon'
      ref={svgRef}
      {...props}
    />
  );
};
