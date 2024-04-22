import emailIconSrc from '@corbado/shared-ui/assets/email.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const EmailIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, emailIconSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='expand-icon'
      {...props}
    />
  );
});
