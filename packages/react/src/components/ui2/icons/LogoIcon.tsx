import logoSrc from '@corbado/shared-ui/assets/logo.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const CorbadoLogoIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, logoSrc, '--cb-button-text-primary-color');

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      {...props}
    />
  );
});
