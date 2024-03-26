import type { FC } from 'react';
import React, { useState } from 'react';
import type { Country, Value } from 'react-phone-number-input';
import PhoneInput from 'react-phone-number-input';

import { SecondaryButton } from '../buttons/SecondaryButton';
import ErrorMessage from '../errors/ErrorMessage';
import { Text } from '../typography/Text';
import { CountrySelect } from './CountrySelect';

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
  onChange: (value: string) => void;
  autocomplete?: string;
}

export const PhoneInputField: FC<PhoneInputFieldProps> = ({
  label,
  labelLink,
  id,
  errorMessage,
  initialCountry,
  initialPhoneNumber,
  autocomplete = 'tel',
  onChange,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<Value>(initialPhoneNumber || '');

  const onChange_ = (value: Value) => {
    setPhoneNumber(value);
    onChange(value);
  };

  return (
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

      <PhoneInput
        className='cb-phone-input-field'
        limitMaxLength={true}
        smartCaret={false}
        value={phoneNumber}
        onChange={onChange_}
        countrySelectComponent={CountrySelect}
        international
        countryCallingCodeEditable={true}
        defaultCountry={initialCountry ?? undefined}
        autoComplete={autocomplete}
        onCountryChange={value => {
          console.log('Country changed:', value);
        }}
      />
      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  );
};
