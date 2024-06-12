import type { InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import { Input } from './Input';
import { Text } from './Text';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  id?: string;
  errorMessage?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type = 'text', id, errorMessage, className, ...props }, ref) => (
    <div className={`cb-input-field${className ? ` ${className}` : ''}`}>
      {label && (
        <label
          htmlFor={id}
          className='cb-input-label'
        >
          <Text
            level='2'
            fontFamilyVariant='secondary'
            className='cb-input-label-text'
            textColorVariant='script'
          >
            {label}
          </Text>
        </label>
      )}
      <Input
        {...props}
        type={type}
        id={id}
        aria-label={label}
        ref={ref}
        hasError={!!errorMessage}
      />
      {errorMessage && <Text>{errorMessage}</Text>}
    </div>
  ),
);

export default InputField;
