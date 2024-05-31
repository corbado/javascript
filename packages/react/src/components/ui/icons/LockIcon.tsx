import lockIconSrc from '@corbado/shared-ui/assets/lock.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const LockIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, lockIconSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='lock-icon'
      {...props}
    />
  );
});
