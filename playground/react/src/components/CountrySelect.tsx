import { ChangeEvent, ElementType, FC, useCallback, useMemo } from 'react';
import { Country, getCountryCallingCode } from 'react-phone-number-input';

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

export const CountrySelectWithIcon: FC<CountrySelectProps> = ({
  value,
  options,
  iconComponent: Icon,
  arrowComponent: Arrow = DefaultArrowComponent,
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
    <div className='phone-input-field-button'>
      <select
        {...rest}
        className='phone-input-field-selection'
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
              className={`phone-input-field-selection-item${countryCode === value ? ' phone-input-field-selection-item-selected' : ''}`}
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
      <Arrow />
    </div>
  );
};

function DefaultArrowComponent() {
  return <div className='PhoneInputCountrySelectArrow' />;
}

function getSelectedOption(options: CountryOption[], value: Country | undefined) {
  for (const option of options) {
    if (!option.divider && option.value === value) {
      return option;
    }
  }
}
