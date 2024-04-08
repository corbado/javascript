import passkeyAppendedSrc from '@corbado/shared-ui/assets/passkey-appended.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const PasskeyAppendedIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, passkeyAppendedSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      {...props}
    />
  );
});
