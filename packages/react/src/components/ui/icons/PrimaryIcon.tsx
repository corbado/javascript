import primaryIconSrc from '@corbado/shared-ui/assets/primary.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const PrimaryIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, primaryIconSrc, '--cb-passkey-list-badge-color');

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='primary-icon'
      {...props}
    />
  );
});
