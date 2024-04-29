import rightIconSrc from '@corbado/shared-ui/assets/right-arrow.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const RightIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, rightIconSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='right-icon'
      {...props}
    />
  );
});
