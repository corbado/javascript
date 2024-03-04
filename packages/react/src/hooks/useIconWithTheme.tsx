import { updateSvgFillColor } from '@corbado/shared-ui';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import useTheme from './useTheme';

export function useIconWithTheme(
  svgRef: RefObject<HTMLImageElement>,
  iconSrc: string,
  color = '--cb-secondary-text-color',
) {
  const { themeUpdateTS } = useTheme();
  const [logoSVG, setLogoSVG] = useState<string>(iconSrc);

  useEffect(() => {
    if (svgRef.current === null) {
      return;
    }

    const rootStyle = getComputedStyle(svgRef.current);
    const fetchedColor = rootStyle.getPropertyValue(color).trim();
    const newSvg = updateSvgFillColor(logoSVG, fetchedColor);
    setLogoSVG(newSvg);
  }, [themeUpdateTS]);

  return { logoSVG };
}
