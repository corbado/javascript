import type { FC } from 'react';
import React from 'react';

import type { CustomizableComponent } from '../../types/common';

export const Body: FC<CustomizableComponent> = ({ children, className = '' }) => {
  return <p className={`cb-body text-center ${className}`}>{children}</p>;
};
