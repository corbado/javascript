import { UAParser } from 'ua-parser-js';

export function getParsedUA(ua: string) {
  const { browser, os } = UAParser(ua);
  return { browser, os };
}

export const updateSvgFillColor = (base64Svg: string, newColor: string) => {
  try {
    const decodedSvg = atob(base64Svg.split(',')[1]);

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(decodedSvg, 'image/svg+xml');
    svgDoc.documentElement.style.setProperty('fill', newColor);

    const serializer = new XMLSerializer();
    const updatedSvg = serializer.serializeToString(svgDoc.documentElement);
    const updatedBase64Svg = `data:image/svg+xml;base64,${btoa(updatedSvg)}`;

    return updatedBase64Svg;
  } catch (error) {
    return base64Svg;
  }
};

export const updateSvgStrokeColor = (base64Svg: string, newColor: string) => {
  const decodedSvg = atob(base64Svg.split(',')[1]);

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(decodedSvg, 'image/svg+xml');
  svgDoc.documentElement.style.setProperty('stroke', newColor);

  const serializer = new XMLSerializer();
  const updatedSvg = serializer.serializeToString(svgDoc.documentElement);
  const updatedBase64Svg = `data:image/svg+xml;base64,${btoa(updatedSvg)}`;

  return updatedBase64Svg;
};
