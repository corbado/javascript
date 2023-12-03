import type { FC } from 'react';
import React from 'react';

import type { CustomizableComponent } from '../types/common';

export const Header: FC<CustomizableComponent> = ({ children, className = '' }) => {
  return <h1 className={`cb-header ${className}`}>{children}</h1>;
};
