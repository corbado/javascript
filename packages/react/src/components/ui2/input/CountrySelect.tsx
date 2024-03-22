import type { ChangeEvent, ElementType, FC } from 'react';
import React from 'react';
import { useCallback, useMemo } from 'react';
import type { Country } from 'react-phone-number-input';
import { getCountryCallingCode } from 'react-phone-number-input';

interface CountryOption {
  value: Country;
  label: string;
  divider?: boolean;
}

interface CountrySelectProps {
  unicodeFlags?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  value?: Country;
  options: CountryOption[];
  iconComponent?: ElementType<{ country: Country; label: string }>;
  arrowComponent?: ElementType;
  onChange: (value: Country) => void;
}

export const CountrySelect: FC<CountrySelectProps> = ({
  value,
  options,
  iconComponent: Icon,
  disabled,
  readOnly,
  onChange,
  ...rest
}) => {
  const selectedOption = useMemo(() => {
    return getSelectedOption(options, value);
  }, [options, value]);

  const onChange_ = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as Country;
      onChange(value);
    },
    [onChange],
  );

  return (
    <div className='cb-phone-input-field-button'>
      <select
        {...rest}
        className='cb-phone-input-field-selection'
        disabled={disabled || readOnly}
        value={value}
        onChange={onChange_}
      >
        {options
          .filter(({ value, divider }) => !divider && value)
          .map(({ value: countryCode, label }) => (
            <option
              key={countryCode}
              value={countryCode}
              disabled={countryCode === value}
              className={`cb-phone-input-field-selection-item${countryCode === value ? ' cb-phone-input-field-selection-item-selected' : ''}`}
            >
              {label} (+{getCountryCallingCode(countryCode) || ''})
            </option>
          ))}
      </select>
      {Icon && (
        <Icon
          country={value ?? 'US'}
          label={(selectedOption && selectedOption.label) ?? ''}
        />
      )}
    </div>
  );
};

function getSelectedOption(options: CountryOption[], value: Country | undefined) {
  for (const option of options) {
    if (!option.divider && option.value === value) {
      return option;
    }
  }

  return null;
}
