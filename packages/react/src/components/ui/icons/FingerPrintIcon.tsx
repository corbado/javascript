import { PlatformType } from '@corbado/shared-ui';
import fingerprintAndroid from '@corbado/shared-ui/assets/fingerprint-android.svg';
import fingerprintApple from '@corbado/shared-ui/assets/fingerprint-apple.svg';
import fingerprintDefault from '@corbado/shared-ui/assets/fingerprint-default.svg';
import fingerprintWindows from '@corbado/shared-ui/assets/fingerprint-windows.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { ColorType, useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export interface FingerPrintIconProps extends IconProps {
  platform?: PlatformType;
}

const getPlatformIcon = (platform: PlatformType | undefined) => {
  switch (platform) {
    case PlatformType.Apple:
      return fingerprintApple;
    case PlatformType.Android:
      return fingerprintAndroid;
    case PlatformType.Windows:
      return fingerprintWindows;
    default:
      return fingerprintDefault;
  }
};

export const FingerPrintIcon: FC<FingerPrintIconProps> = memo(({ platform, ...props }) => {
  const svgRef = useRef<HTMLImageElement>(null);
  const fingerprintSrc = getPlatformIcon(platform);
  const { logoSVG } = useIconWithTheme(svgRef, fingerprintSrc, '--cb-text-primary-color', ColorType.FillAndStroke);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='fingerprint-icon'
      {...props}
    />
  );
});
