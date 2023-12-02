import { FC } from 'react';
import { CustomizableComponent } from '../types/common';

export const Body: FC<CustomizableComponent> = ({ children, className = '' }) => {
  return <p className={`cb-body text-center ${className}`}>{children}</p>;
};
