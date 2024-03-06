import passkeyErrorSrc from '@corbado/shared-ui/assets/passkey-error.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const PasskeyErrorIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, passkeyErrorSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      {...props}
    />
  );
});
