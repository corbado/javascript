import type { FC } from 'react';
import React from 'react';

import { Text } from './typography/Text';

export interface DividerProps {
  label: string;
  className?: string;
}

export const Divider: FC<DividerProps> = ({ label, className }) => {
  return (
    <div className={`cb-divider-container-2 ${className ? ` ${className}` : ''}`}>
      <div className='cb-divider-line-2'></div>
      <div className='cb-divider-text-2'>
        <Text
          level='1'
          textColorVariant='secondary'
          fontWeight='normal'
          className='cb-row-2'
        >
          {label}
        </Text>
      </div>
      <div className='cb-divider-line-2'></div>
    </div>
  );
};
