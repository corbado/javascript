import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const SubHeader: FC<PropsWithChildren> = ({ children }) => {
  return <p className='cb-subheader-2'>{children}</p>;
};
