import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import firstPageSrc from '../../../shared-ui/assets/first-page.svg';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const FirstPageIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, firstPageSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='first-page'
      {...props}
    />
  );
});
