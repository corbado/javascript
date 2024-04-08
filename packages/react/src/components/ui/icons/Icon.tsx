import type { CSSProperties } from 'react';
import React, { forwardRef } from 'react';

export interface IconProps {
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

interface Props extends IconProps {
  src: string;
  alt?: string;
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
