import { FC } from 'react';
import { CustomizableComponent } from '../types/common';

export const HorizontalRule: FC<CustomizableComponent> = ({ children, className = '' }) => (
  <div className={`cb-horizontal-divider ${className}`}>{children}</div>
);
