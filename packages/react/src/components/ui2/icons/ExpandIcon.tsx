import expandIconSrc from '@corbado/shared-ui/assets/expand.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const ExpandIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, expandIconSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='expand-icon'
      {...props}
    />
  );
});
