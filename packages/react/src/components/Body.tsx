import type { FC } from 'react';
import React from 'react';

import type { ICustomizableComponent } from '../types/common';

export const Body: FC<ICustomizableComponent> = ({ children, className = '' }) => {
  return <p className={`cb-body text-center ${className}`}>{children}</p>;
};
