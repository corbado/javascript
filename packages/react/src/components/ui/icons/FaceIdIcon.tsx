import faceIdSrc from '@corbado/shared-ui/assets/face-id.svg';
import type { FC } from 'react';
import React, { useRef } from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const FaceIdIcon: FC<IconProps> = props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, faceIdSrc, '--cb-text-primary-color', true);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='face-id-icon'
      {...props}
    />
  );
};
