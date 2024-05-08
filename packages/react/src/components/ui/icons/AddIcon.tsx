import addSrc from '@corbado/shared-ui/assets/add.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const AddIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, addSrc, '--cb-button-text-primary-color');

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='add'
      {...props}
    />
  );
});
