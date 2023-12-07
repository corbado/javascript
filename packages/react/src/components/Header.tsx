import type { FC } from 'react';
import React from 'react';

import type { ICustomizableComponent } from '../types/common';

export const Header: FC<ICustomizableComponent> = ({ children, className = '' }) => {
  return <h1 className={`cb-header ${className}`}>{children}</h1>;
};
