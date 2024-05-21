import { PlatformType } from '@corbado/shared-ui';
import faceIdAndroid from '@corbado/shared-ui/assets/face-id-android.svg';
import faceIdApple from '@corbado/shared-ui/assets/face-id-apple.svg';
import faceIdDefault from '@corbado/shared-ui/assets/face-id-default.svg';
import faceIdWindows from '@corbado/shared-ui/assets/face-id-windows.svg';
import type { FC } from 'react';
import React, { memo, useRef } from 'react';

import { ColorType, useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export interface FaceIdIconProps extends IconProps {
  platform?: PlatformType;
}

const getPlatformIcon = (platform: PlatformType | undefined) => {
  switch (platform) {
    case PlatformType.Apple:
      return faceIdApple;
    case PlatformType.Android:
      return faceIdAndroid;
    case PlatformType.Windows:
      return faceIdWindows;
    default:
      return faceIdDefault;
  }
};

export const FaceIdIcon: FC<FaceIdIconProps> = memo(({ platform, ...props }) => {
  const svgRef = useRef<HTMLImageElement>(null);
  const faceIdSrc = getPlatformIcon(platform);
  const { logoSVG } = useIconWithTheme(svgRef, faceIdSrc, '--cb-text-primary-color', ColorType.FillAndStroke);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='face-id-icon'
      {...props}
    />
  );
});
