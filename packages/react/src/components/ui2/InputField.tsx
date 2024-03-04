import type { InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import ErrorMessage from './errors/ErrorMessage';
import { Text } from './typography/Text';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  id: string;
  errorMessage?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type = 'text', id, errorMessage, ...props }, ref) => (
    <div className='cb-input-field-2'>
      <label htmlFor={id}>
        <Text
          level='2'
          fontFamilyVariant='secondary'
          className='cb-input-label-2'
        >
          {label}
        </Text>
      </label>
      <input
        {...props}
        type={type}
        id={id}
        className={`cb-text-2-2 cb-input-2 ${errorMessage ? 'cb-input-error-2' : ''}`}
        aria-label={label}
        ref={ref}
      />
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  ),
);

export default InputField;
