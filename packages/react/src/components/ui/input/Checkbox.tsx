import type { InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import { Text } from '../typography';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  hasError?: boolean;
  label: string;
  checked: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, checked, onChange, disabled, className }, ref) => {
    return (
      <label className={`cb-checkbox-input-field${className ? ` ${className}` : ''}`}>
        <Text
          level='2'
          textColorVariant='secondary'
        >
          {label}
        </Text>
        <input
          type='checkbox'
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          ref={ref}
        />
        <span className='cb-checkbox-input'></span>
      </label>
    );
  },
);

export default Checkbox;
