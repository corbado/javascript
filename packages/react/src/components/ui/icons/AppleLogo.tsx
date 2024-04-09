import appleSrc from '@corbado/shared-ui/assets/apple.svg';
import type { FC } from 'react';
import React, { useRef } from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const AppleIcon: FC<IconProps> = props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, appleSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='apple-logo'
      {...props}
    />
  );
};

export default AppleIcon;
