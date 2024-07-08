import type { FC, PropsWithChildren, ReactNode } from 'react';
import React from 'react';

export interface TextProps {
    children: ReactNode;
}

export const Tag: FC<PropsWithChildren<TextProps>> = ({
  children,
}) => {
  return (
    <div className='cb-tag'>
        {children}
    </div>
  );
};
