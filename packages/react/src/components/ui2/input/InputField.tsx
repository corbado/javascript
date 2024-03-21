import type { InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import { SecondaryButton } from '../buttons/SecondaryButton';
import ErrorMessage from '../errors/ErrorMessage';
import { Text } from '../typography/Text';
import { Input } from './Input';
import PhoneInput from './PhoneInput';

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  id?: string;
  errorMessage?: string;
  labelLink?: {
    text: string;
    onClick: () => void;
  };
  showPhoneNumberInput?: boolean;
  onInputChange?: (value: string) => void;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, labelLink, showPhoneNumberInput, type = 'text', id, errorMessage, onInputChange, ...props }, ref) => (
    <div className='cb-input-field'>
      {label && (
        <label
          htmlFor={id}
          className='cb-input-label'
        >
          <Text
            level='2'
            fontFamilyVariant='secondary'
            className='cb-input-label-text'
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
      {showPhoneNumberInput ? (
        <PhoneInput
          onChange={value => onInputChange && onInputChange(value)}
          hasError={!!errorMessage}
          ref={ref}
        />
      ) : (
        <Input
          {...props}
          type={type}
          id={id}
          aria-label={label}
          ref={ref}
          hasError={!!errorMessage}
        />
      )}
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  ),
);

export default InputField;
