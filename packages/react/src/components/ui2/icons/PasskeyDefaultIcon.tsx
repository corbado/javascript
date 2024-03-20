import passkeyDefaultSrc from '@corbado/shared-ui/assets/passkey-default.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const PasskeyDefaultIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, passkeyDefaultSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='passkey-default'
      {...props}
    />
  );
});
