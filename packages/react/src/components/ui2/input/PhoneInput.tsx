import parsePhoneNumberFromString, {
  AsYouType,
  type CountryCode,
  getCountries,
  getCountryCallingCode,
} from 'libphonenumber-js';
import type { ChangeEvent, FC } from 'react';
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import flags from 'react-phone-number-input/flags';
import en from 'react-phone-number-input/locale/en.json';

interface PhoneInputProps {
  hasError?: boolean;
  className?: string;
  onChange: (value: string | undefined) => void;
}

const countries = getCountries();

export const PhoneInputField: FC<PhoneInputProps> = ({ className, hasError, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const asYouTypeRef = useRef(new AsYouType('US'));
  const selectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const Flag = flags[selectedCountry];

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
      console.log(parsedNumber);
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

  return (
    <div className={`phone-input-field${hasError ? ' cb-input-error' : ''}${className ? ` ${className}` : ''}`}>
      <button
        type='button'
        className='phone-input-field-button'
        onClick={toggleDropdown}
      >
        {Flag && <Flag title={selectedCountry} />}{' '}
        <div>
          <span className='cb-text-2'>+{getCountryCallingCode(selectedCountry)}</span>
        </div>
      </button>
      <input
        className='cb-text-2 phone-input-field-input'
        placeholder=''
        id='phone'
        name='phone'
        autoComplete='tel'
        type='tel'
        inputMode='numeric'
        value={phoneNumber}
        onChange={onPhoneChange}
      />

      {isOpen && (
        <div
          className='phone-input-field-selection'
          ref={selectionRef}
        >
          <input
            ref={searchInputRef}
            type='text'
            placeholder='Search...'
            className='phone-input-field-search'
            onChange={onSearchChange}
          />
          {filteredCountries.map(option => {
            const Flag = flags[option];

            return (
              <div
                key={option}
                className={`phone-input-field-selection-item${option === selectedCountry ? ' phone-input-field-selection-item-selected' : ''}`}
                onClick={() => handleCountryChange(option)}
              >
                {Flag && <Flag title={option} />}
                <span className='cb-text-2'>
                  {en[option]} (+{getCountryCallingCode(option)})
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
