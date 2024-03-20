import deleteSrc from '@corbado/shared-ui/assets/delete.svg';
import type { FC } from 'react';
import { memo, useRef } from 'react';
import React from 'react';

import { useIconWithTheme } from '../../../hooks/useIconWithTheme';
import type { IconProps } from './Icon';
import { Icon } from './Icon';

export const DeleteIcon: FC<IconProps> = memo(props => {
  const svgRef = useRef<HTMLImageElement>(null);
  const { logoSVG } = useIconWithTheme(svgRef, deleteSrc);

  return (
    <Icon
      src={logoSVG}
      ref={svgRef}
      alt='delete'
      {...props}
    />
  );
});
