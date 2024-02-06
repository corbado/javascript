import type { CSSProperties, FC } from 'react';
import React from 'react';

import type { CustomizableComponent } from '../../../types';

export interface Props extends Omit<CustomizableComponent, 'children'> {
  src: string;
  alt?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

export const Icon: FC<Props> = ({ src, style, alt = '', onClick, className = '' }) => {
  return (
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      style={style}
      className={`cb-icon ${onClick ? 'cb-pointer' : ''} ${className}`}
    ></img>
  );
};
