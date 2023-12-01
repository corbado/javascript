import { FC } from 'react';
import { CustomizableComponent } from '../types/common';

export const Header: FC<CustomizableComponent> = ({ children, className = '' }) => {
  return <h1 className={`cb-header ${className}`}>{children}</h1>;
};
