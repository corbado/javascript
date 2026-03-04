function parseSVG(base64Svg: string) {
  const decodedSvg = atob(base64Svg.split(',')[1]);

  const parser = new DOMParser();
  return parser.parseFromString(decodedSvg, 'image/svg+xml');
}

function serializeSVG(svgDoc: Document) {
  const serializer = new XMLSerializer();
  const updatedSvg = serializer.serializeToString(svgDoc.documentElement);
  return `data:image/svg+xml;base64,${btoa(updatedSvg)}`;
}

export const updateSvgFillColor = (base64Svg: string, newColor: string) => {
  try {
    const svgDoc = parseSVG(base64Svg);

    svgDoc.documentElement.style.setProperty('fill', newColor);

    return serializeSVG(svgDoc);
  } catch (error) {
    return base64Svg;
  }
};

export const updateSvgStrokeColor = (base64Svg: string, newColor: string) => {
  try {
    const svgDoc = parseSVG(base64Svg);
    svgDoc.documentElement.style.setProperty('stroke', newColor);

    return serializeSVG(svgDoc);
  } catch (error) {
    return base64Svg;
  }
};

export const updateSvgColors = (base64Svg: string, newColor: string) => {
  try {
    const svgDoc = parseSVG(base64Svg);

    const fillElements = svgDoc.querySelectorAll('[data-fill]');
    fillElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.setProperty('fill', newColor);
      } else {
        element.setAttribute('fill', newColor);
      }
    });

    const strokeElements = svgDoc.querySelectorAll('[data-stroke]');
    strokeElements.forEach(element => {
      if (element instanceof HTMLElement) {
        element.style.setProperty('stroke', newColor);
      } else {
        element.setAttribute('stroke', newColor);
      }
    });

    return serializeSVG(svgDoc);
  } catch (error) {
    return base64Svg;
  }
};
