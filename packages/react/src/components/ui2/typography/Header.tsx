import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { Text } from './Text';

interface HeaderProps {
  size?: 'md' | 'lg';
  className?: string;
}

export const Header: FC<PropsWithChildren<HeaderProps>> = ({ size, className, children }) => {
  return (
    <Text
      level={size === 'lg' ? '7' : '6'}
      fontWeight='bold'
      className={`cb-header-2${className ? ` ${className}` : ''}`}
    >
      {children}
    </Text>
  );
};
