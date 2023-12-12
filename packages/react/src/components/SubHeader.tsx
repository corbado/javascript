import type { FC } from 'react';
import React from 'react';

import type { CustomizableComponent } from '../types/common';

export const SubHeader: FC<CustomizableComponent> = ({ children, className = '' }) => {
  return <h2 className={`cb-subheader ${className}`}>{children}</h2>;
};
