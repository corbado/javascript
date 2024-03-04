import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { Text } from './Text';

export const Header: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Text
      level='6'
      fontWeight='bold'
      className='cb-header-2'
    >
      {children}
    </Text>
  );
};
