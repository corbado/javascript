import { updateSvgFillColor } from '@corbado/shared-ui';
import corbadoLogoSrc from '@corbado/shared-ui/assets/logo.svg';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import React from 'react';

import { Icon } from './Icon';
import type { IconProps } from './Icons';

export const CorbadoLogoIcon: FC<IconProps> = ({ style, className, onClick }) => {
  const [logoSVG, setLogoSVG] = useState<string>(corbadoLogoSrc);

  useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const fetchedColor = rootStyle.getPropertyValue('--cb-secondary-text-color').trim();
    const newSvg = updateSvgFillColor(corbadoLogoSrc, fetchedColor);
    setLogoSVG(newSvg);
  }, []);

  return (
    <Icon
      src={logoSVG}
      style={style}
      className={className}
      onClick={onClick}
    />
  );
};
