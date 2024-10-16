import type { InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import { SecondaryButton } from '../buttons/SecondaryButton';
import ErrorMessage from '../errors/ErrorMessage';
import { Text } from '../typography/Text';
import { Input } from './Input';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  id?: string;
  errorMessage?: string;
  labelLink?: {
    text: string;
    onClick: () => void;
  };
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, labelLink, type = 'text', id, errorMessage, className, ...props }, ref) => (
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

          {labelLink && (
            <span className='cb-input-label-link'>
              <SecondaryButton
                colorVariant='link'
                onClick={labelLink.onClick}
              >
                {labelLink.text}
              </SecondaryButton>
            </span>
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
