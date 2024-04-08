import deviceIconSrc from '@corbado/shared-ui/assets/device-icon.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const DeviceIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, deviceIconSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='device-icon'
      {...props}
    />
  );
});
