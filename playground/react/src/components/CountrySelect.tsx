import { ChangeEvent, ElementType, FC, useCallback, useMemo } from 'react';
import { Country, getCountryCallingCode } from 'react-phone-number-input';

interface CountryOption {
  value: Country;
  label: string;
  divider?: boolean;
}

interface CountrySelectProps {
  /**
   * A two-letter country code.
   * Example: "US", "RU", etc.
   */
  value?: Country;

  /**
   * A function of `value: string`.
   * Updates the `value` property.
   */
  onChange: (value: Country) => void;

  /**
   * `<select/>` options.
   */
  options: CountryOption[];

  /**
   * `readonly` attribute doesn't work on a `<select/>`.
   * To work around that, if `readOnly: true` property is passed
   * to this component, it behaves analogous to `disabled: true`.
   */
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

interface CountrySelectWithIconProps extends CountrySelectProps {
  // Country flag component.
  iconComponent?: ElementType<{ country: Country; label: string }>;

  // Select arrow component.
  arrowComponent?: ElementType;

  // Set to `true` to render Unicode flag icons instead of SVG images.
  unicodeFlags?: boolean;
}

export const CountrySelect: FC<CountrySelectProps> = ({ value, onChange, options, disabled, readOnly, ...rest }) => {
  const onChange_ = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as Country;
      onChange(value);
    },
    [onChange],
  );

  return (
    <select
      {...rest}
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
          >
            {label}
          </option>
        ))}
    </select>
  );
};

export const CountrySelectWithIcon: FC<CountrySelectWithIconProps> = ({
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
    <div className='cb-phone-input-field'>
      <select
        {...rest}
        className='PhoneInputCountrySelect cb-phone-input-field-selection'
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
      <div className='cb-phone-input-field-button'>
        {Icon && (
          <Icon
            country={value ?? 'US'}
            label={(selectedOption && selectedOption.label) ?? ''}
          />
        )}{' '}
        +{getCountryCallingCode(value ?? 'US') || ''}
        <Arrow />
      </div>
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
