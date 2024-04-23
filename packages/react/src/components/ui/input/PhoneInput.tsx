import parsePhoneNumberFromString, {
  AsYouType,
  type CountryCode,
  getCountries,
  getCountryCallingCode,
} from 'libphonenumber-js';
import type { ChangeEvent, FC, KeyboardEvent as ReactKeyboardEvent } from 'react';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import flags from 'react-phone-number-input/flags';
import en from 'react-phone-number-input/locale/en.json';

import { ExpandIcon } from '../icons/ExpandIcon';
import { Text } from '../typography/Text';

interface PhoneInputProps {
  hasError?: boolean;
  className?: string;
  initialCountry?: CountryCode;
  initialPhoneNumber?: string;
  autoComplete?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onChange: (value: string | undefined) => void;
}

const countries = getCountries();

export const PhoneInput: FC<PhoneInputProps> = ({
  className,
  hasError,
  initialCountry,
  initialPhoneNumber,
  disabled,
  autoFocus,
  autoComplete = 'tel',
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(initialCountry ?? 'US');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const asYouTypeRef = useRef(new AsYouType('US'));
  const selectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const Flag = flags[selectedCountry];

  useEffect(() => {
    if (!initialPhoneNumber) {
      return;
    }

    const parsedNumber = parsePhoneNumberFromString(initialPhoneNumber);
    if (!parsedNumber) {
      return;
    }

    handleCountryChange(parsedNumber.country);
    setPhoneNumber(parsedNumber.nationalNumber);
    onChange(parsedNumber.number);
  }, [initialPhoneNumber]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectionRef.current && !selectionRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectionRef]);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    } else {
      setFilteredCountries(countries);
    }
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCountryChange = (option: CountryCode | undefined) => {
    setSelectedCountry(option ?? 'US');
    asYouTypeRef.current = new AsYouType(option ?? 'US');
    setIsOpen(false);

    if (phoneNumber) {
      const formattedNumber = asYouTypeRef.current.input(phoneNumber);
      setPhoneNumber(formattedNumber);
      onChange(asYouTypeRef.current.getNumberValue());
    }
  };

  const onPhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target;
    const input = inputElement.value;

    const parsedNumber = parsePhoneNumberFromString(input);

    if (parsedNumber) {
      handleCountryChange(parsedNumber.country);
      setPhoneNumber(parsedNumber.nationalNumber);
      onChange(parsedNumber.number);

      return;
    }

    const formatter = asYouTypeRef.current;
    formatter.reset();
    formatter.input(input);

    setPhoneNumber(input);
    onChange(asYouTypeRef.current.getNumberValue());
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const countriesList = countries.filter(
      option => en[option].toLowerCase().includes(searchTerm) || option.toLowerCase().includes(searchTerm),
    );

    setFilteredCountries(countriesList);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (!phoneNumber) {
        setIsOpen(true);
        event.preventDefault();
      }
    }
  };

  return (
    <div
      className={`cb-phone-input-field${hasError ? ' cb-input-error' : ''}${
        disabled ? ' cb-phone-input-field-disabled' : ''
      }${className ? ` ${className}` : ''}`}
    >
      <button
        type='button'
        className={`cb-phone-input-field-button cb-text-2${disabled ? ' cb-phone-input-field-button-disabled' : ''}`}
        disabled={disabled}
        onClick={toggleDropdown}
      >
        {Flag && <Flag title={selectedCountry} />}{' '}
        <Text
          level='2'
          fontFamilyVariant='secondary'
        >
          +{getCountryCallingCode(selectedCountry)}
        </Text>
        <ExpandIcon />
      </button>
      <input
        className='cb-text-2 cb-phone-input-field-input'
        placeholder=''
        id='phone'
        name='phone'
        autoComplete={autoComplete}
        type='tel'
        inputMode='numeric'
        maxLength={13}
        autoFocus={autoFocus}
        value={phoneNumber}
        disabled={disabled}
        onChange={onPhoneChange}
        onKeyDown={handleKeyDown}
      />

      {isOpen && (
        <div
          className='cb-phone-input-field-selection'
          ref={selectionRef}
        >
          <input
            ref={searchInputRef}
            type='text'
            placeholder='Search...'
            className='cb-text-2 cb-phone-input-field-search'
            onChange={onSearchChange}
          />
          {filteredCountries.map(option => {
            const Flag = flags[option];

            return (
              <div
                key={option}
                className={`cb-phone-input-field-selection-item${
                  option === selectedCountry ? ' cb-phone-input-field-selection-item-selected' : ''
                }`}
                onClick={() => handleCountryChange(option)}
              >
                {Flag && <Flag title={option} />}
                <Text
                  level='2'
                  fontFamilyVariant='secondary'
                >
                  {en[option]} (+{getCountryCallingCode(option)})
                </Text>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
