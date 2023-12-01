import { FC } from 'react';
import { CustomizableComponent } from '../types/common';

export const Body: FC<CustomizableComponent> = ({ children, className = '' }) => {
  return <p className={`body text-center ${className}`}>{children}</p>;
};
