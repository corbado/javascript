import { updateSvgColors, updateSvgFillColor, updateSvgStrokeColor } from '@corbado/shared-ui';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

import useTheme from './useTheme';

export enum ColorType {
  Fill,
  Stroke,
  FillAndStroke,
}

function getColoringFunction(colorType: ColorType) {
  switch (colorType) {
    case ColorType.Fill:
      return updateSvgFillColor;
    case ColorType.Stroke:
      return updateSvgStrokeColor;
    case ColorType.FillAndStroke:
      return updateSvgColors;
    default:
      return updateSvgFillColor;
  }
}

export function useIconWithTheme(
  svgRef: RefObject<HTMLImageElement>,
  iconSrc: string,
  color = '--cb-text-primary-color',
  colorType = ColorType.Fill,
) {
  const { themeUpdateTS } = useTheme();
  const [logoSVG, setLogoSVG] = useState<string>(iconSrc);

  useEffect(() => {
    if (svgRef.current === null) {
      return;
    }

    const rootStyle = getComputedStyle(svgRef.current);
    const fetchedColor = rootStyle.getPropertyValue(color).trim();
    const newSvg = getColoringFunction(colorType)(logoSVG, fetchedColor);
    setLogoSVG(newSvg);
  }, [themeUpdateTS]);

  return { logoSVG };
}
