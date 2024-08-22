import syncIconSrc from '@corbado/shared-ui/assets/tick.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { ColorType, useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const TickIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, syncIconSrc, '--cb-success-color', ColorType.Stroke);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='success-icon'
      {...props}
    />
  );
});
