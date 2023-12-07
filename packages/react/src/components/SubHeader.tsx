import type { FC } from 'react';
import React from 'react';

import type { ICustomizableComponent } from '../types/common';

export const SubHeader: FC<ICustomizableComponent> = ({ children, className = '' }) => {
  return <h2 className={`cb-subheader ${className}`}>{children}</h2>;
};
