import type { FC, PropsWithChildren } from 'react';
import React from 'react';

import { Text } from './Text';

export const SubHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Text
      fontWeight='normal'
      level='5'
      textColorVariant='primary'
      className='cb-subheader'
    >
      {children}
    </Text>
  );
};
