import type { CSSProperties } from 'react';
import React, { forwardRef } from 'react';

import type { CustomizableComponent } from '../../../types';

export interface Props extends Omit<CustomizableComponent, 'children'> {
  src: string;
  alt?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export const Icon = forwardRef<HTMLImageElement, Props>(({ src, style, alt = '', onClick, className = '' }, ref) => {
  return (
    <img
      src={src}
      ref={ref}
      alt={alt}
      onClick={onClick}
      style={style}
      className={`cb-icon ${onClick ? 'cb-pointer' : ''} ${className}`}
    ></img>
  );
});
