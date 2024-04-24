import phoneIconSrc from '@corbado/shared-ui/assets/phone.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const PhoneIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, phoneIconSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='phone-icon'
      {...props}
    />
  );
});
