import { updateSvgFillColor, updateSvgStrokeColor } from '@corbado/shared-ui';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import useTheme from './useTheme';

export function useIconWithTheme(
  svgRef: RefObject<HTMLImageElement>,
  iconSrc: string,
  color = '--cb-text-primary-color',
  addColorInStroke = false,
) {
  const { themeUpdateTS } = useTheme();
  const [logoSVG, setLogoSVG] = useState<string>(iconSrc);

  useEffect(() => {
    if (svgRef.current === null) {
      return;
    }

    const rootStyle = getComputedStyle(svgRef.current);
    const fetchedColor = rootStyle.getPropertyValue(color).trim();
    const newSvg = addColorInStroke
      ? updateSvgStrokeColor(logoSVG, fetchedColor)
      : updateSvgFillColor(logoSVG, fetchedColor);
    setLogoSVG(newSvg);
  }, [themeUpdateTS]);

  return { logoSVG };
}
