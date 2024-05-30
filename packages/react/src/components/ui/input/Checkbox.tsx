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
      <div className={`cb-checkbox-input-field${className ? ` ${className}` : ''}`}>
        <input
          type='checkbox'
          id={id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          ref={ref}
          className='cb-checkbox-input'
        />
        <label htmlFor={id}>
          <Text
            level='2'
            textColorVariant='secondary'
          >
            {label}
          </Text>
        </label>
      </div>
    );
  },
);

export default Checkbox;
