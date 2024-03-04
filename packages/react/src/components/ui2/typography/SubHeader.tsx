import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { Text } from './Text';

export const SubHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Text
      fontWeight='bold'
      level='5'
      textColorVariant='secondary'
      className='cb-subheader-2'
    >
      {children}
    </Text>
  );
};
