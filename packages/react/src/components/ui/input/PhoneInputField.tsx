import type { FC } from 'react';
import React from 'react';
import type { Country } from 'react-phone-number-input';

import { SecondaryButton } from '../buttons/SecondaryButton';
import ErrorMessage from '../errors/ErrorMessage';
import { Text } from '../typography/Text';
import { PhoneInput } from './PhoneInput';

export interface PhoneInputFieldProps {
  label?: string;
  type?: string;
  id?: string;
  errorMessage?: string;
  labelLink?: {
    text: string;
    onClick: () => void;
  };
  initialCountry?: Country;
  initialPhoneNumber?: string;
  autoComplete?: string;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
  onChange?: (value: string) => void;
}

export const PhoneInputField: FC<PhoneInputFieldProps> = ({
  label,
  labelLink,
  id,
  errorMessage,
  initialPhoneNumber,
  disabled,
  className,
  autoFocus,
  initialCountry = 'US',
  autoComplete = 'tel',
  onChange,
}) => {
  const onChange_ = (value: string | undefined) => {
    if (onChange) {
      onChange(value || '');
    }
  };

  return (
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

      <PhoneInput
        initialCountry={initialCountry}
        initialPhoneNumber={initialPhoneNumber}
        hasError={!!errorMessage}
        autoComplete={autoComplete}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={onChange_}
      />
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
};
