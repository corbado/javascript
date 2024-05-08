import syncIconSrc from '@corbado/shared-ui/assets/sync.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const SyncIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, syncIconSrc, '--cb-passkey-list-badge-color');

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='sync-icon'
      {...props}
    />
  );
});
