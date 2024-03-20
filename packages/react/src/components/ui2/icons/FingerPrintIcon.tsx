import fingerPrintSrc from '@corbado/shared-ui/assets/fingerprint.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const FingerPrintIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, fingerPrintSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='fingerprint-icon'
      {...props}
    />
  );
});
