import type { FC, PropsWithChildren } from 'react';
import React from 'react';

export const Header: FC<PropsWithChildren> = ({ children }) => {
  return <p className='cb-header-2'>{children}</p>;
};
