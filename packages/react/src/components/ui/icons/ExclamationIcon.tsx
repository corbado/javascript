import exclamationSrc from '@corbado/shared-ui/assets/exclamation.svg';
import React, { memo, useRef } from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const ExclamationIcon = memo((props: IconProps) => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, exclamationSrc, '--cb-error-text-color');

  return (
    <Icon
      src={logoSVG}
      alt='exlamation-icon'
      ref={svgRef}
      {...props}
    />
  );
});
