import type { FC } from 'react';
import React from 'react';

import type { CustomizableComponent } from '../types/common';

export const HorizontalRule: FC<CustomizableComponent> = ({ children, className = '' }) => (
  <div className={`cb-horizontal-divider ${className}`}>{children}</div>
);
