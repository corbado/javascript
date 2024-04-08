import type { FC } from 'react';
import React from 'react';

import { Text } from './typography/Text';

export interface DividerProps {
  label: string;
  className?: string;
}

export const Divider: FC<DividerProps> = ({ label, className }) => {
  return (
    <div className={`cb-divider-container ${className ? ` ${className}` : ''}`}>
      <div className='cb-divider-line'></div>
      <div className='cb-divider-text'>
        <Text
          level='1'
          textColorVariant='primary'
          fontWeight='normal'
          className='cb-row'
        >
          {label}
        </Text>
      </div>
      <div className='cb-divider-line'></div>
    </div>
  );
};
