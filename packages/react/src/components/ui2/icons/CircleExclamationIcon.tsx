import circleExclamationSrc from '@corbado/shared-ui/assets/circle-exclamation.svg';
import React, { memo, useRef } from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const CircleExclamationIcon = memo((props: IconProps) => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, circleExclamationSrc, '--cb-error-text-color');

  return (
    <Icon
      src={logoSVG}
      alt='exlamation-icon'
      ref={svgRef}
      {...props}
    />
  );
});
