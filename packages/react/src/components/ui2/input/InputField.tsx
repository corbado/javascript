import type { InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import { SecondaryButton } from '../buttons/SecondaryButton';
import ErrorMessage from '../errors/ErrorMessage';
import { Text } from '../typography/Text';
import { Input } from './Input';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  id?: string;
  errorMessage?: string;
  labelLink?: {
    text: string;
    onClick: () => void;
  };
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, labelLink, type = 'text', id, errorMessage, ...props }, ref) => (
    <div className='cb-input-field-2'>
      {label && (
        <label htmlFor={id}>
          <Text
            level='2'
            fontFamilyVariant='secondary'
            className='cb-input-label-2'
          >
            {label}
          </Text>

          {labelLink && (
            <SecondaryButton
              className='cb-input-label-link-2'
              colorVariant='link'
              onClick={labelLink.onClick}
            >
              {labelLink.text}
            </SecondaryButton>
          )}
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
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  ),
);

export default InputField;
