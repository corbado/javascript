import passkeyAppendAfterHybridSrc from '@corbado/shared-ui/assets/passkey-append-after-hybrid.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const PasskeyAppendAfterHybridIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, passkeyAppendAfterHybridSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='passkey-append-after-hybrid'
      {...props}
    />
  );
});
