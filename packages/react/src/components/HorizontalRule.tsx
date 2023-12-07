import type { FC } from 'react';
import React from 'react';

import type { ICustomizableComponent } from '../types/common';

export const HorizontalRule: FC<ICustomizableComponent> = ({ children, className = '' }) => (
  <div className={`cb-horizontal-divider ${className}`}>{children}</div>
);
