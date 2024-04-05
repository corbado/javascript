import secureIconSrc from '@corbado/shared-ui/assets/secure-icon.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const SecureIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, secureIconSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='secure-icon'
      {...props}
    />
  );
});
