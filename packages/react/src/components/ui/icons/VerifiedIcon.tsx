import verifiedIconSrc from '@corbado/shared-ui/assets/verified.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const VerifiedIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, verifiedIconSrc, '--cb-passkey-list-badge-color');

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='verified-icon'
      {...props}
    />
  );
});
