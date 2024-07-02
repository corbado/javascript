import type { InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  hasError?: boolean;
  label: string;
  checked: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, checked, onChange, disabled }, ref) => {
    return (
      <div className='cb-checkbox-input-field'>
        <label>
          <input
            type='checkbox'
            id={id}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            ref={ref}
          />
          <span className='cb-p'>{label}</span>
        </label>
      </div>
    );
  },
);

export default Checkbox;
