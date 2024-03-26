import personIconSrc from '@corbado/shared-ui/assets/person.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const PersonIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, personIconSrc, '--cb-box-color-hover');

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='person-icon'
      {...props}
    />
  );
});
