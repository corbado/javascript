import type { FC } from 'react';
import React from 'react';

import type { CustomizableComponent } from '../../../types';

export interface Props extends Omit<CustomizableComponent, 'children'> {
  src: string;
  alt?: string;
  onClick?: () => void;
  className?: string;
}

export const Icon: FC<Props> = ({ src, alt = '', onClick, className }) => {
  return (
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      className={`cb-icon ${className}`}
    ></img>
  );
};
