import type { FC } from 'react';
import React from 'react';

import type { CustomizableComponent } from '../../types';

export interface IconProps extends Omit<CustomizableComponent, 'children'> {
  url: string;
  name?: string;
}

export const Icon: FC<IconProps> = ({ url, name = '', className = '' }) => {
  return (
    <img
      src={url}
      alt={name}
      className={className}
    ></img>
  );
};
