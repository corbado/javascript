import { updateSvgFillColor } from '@corbado/shared-ui';
import corbadoLogoSrc from '@corbado/shared-ui/assets/logo.svg';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import React from 'react';

import useTheme from '../../../hooks/useTheme';
import { Icon } from './Icon';
import type { IconProps } from './Icons';

export const CorbadoLogoIcon: FC<IconProps> = ({ style, className, onClick }) => {
  const { themeUpdateTS } = useTheme();
  const [logoSVG, setLogoSVG] = useState<string>(corbadoLogoSrc);
  const svgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (svgRef.current === null) {
      return;
    }

    const rootStyle = getComputedStyle(svgRef.current);
    const fetchedColor = rootStyle.getPropertyValue('--cb-secondary-text-color').trim();
    const newSvg = updateSvgFillColor(corbadoLogoSrc, fetchedColor);
    setLogoSVG(newSvg);
  }, [themeUpdateTS]);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      style={style}
      className={className}
      onClick={onClick}
    />
  );
};
