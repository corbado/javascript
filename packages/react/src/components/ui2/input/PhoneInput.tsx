import React, { forwardRef } from 'react';
import { useEffect, useRef, useState } from 'react';
import flags from 'react-phone-number-input/flags';
import type { Country } from 'react-phone-number-input/input';
import PhoneInput, { getCountries, getCountryCallingCode } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en.json';

import { Text } from '../typography/Text';

interface PhoneInputProps {
  hasError?: boolean;
  className?: string;
  onChange: (value: Country) => void;
}

const countries = getCountries();

const PhoneInputField = forwardRef<HTMLInputElement, PhoneInputProps>(({ className, hasError, onChange }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>('US');
  const selectionRef = useRef<HTMLDivElement>(null);
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

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (option: Country) => {
    setSelectedCountry(option);
    setIsOpen(false);
  };

  const onPhoneChange = (value: Country) => {
    onChange(value);
  };

  return (
    <div className={`cb-phone-input-field${hasError ? ' cb-input-error' : ''}${className ? ` ${className}` : ''}`}>
      <button
        className='cb-phone-input-field-button'
        onClick={toggleDropdown}
      >
        {Flag && <Flag title={selectedCountry} />}{' '}
        <div>
          <Text
            level='2'
            fontFamilyVariant='secondary'
          >
            +{getCountryCallingCode(selectedCountry)}
          </Text>
        </div>
      </button>
      <PhoneInput
        className='cb-text-2 cb-phone-input-field-input'
        placeholder=''
        id='phone'
        name='phone'
        autoComplete='phone'
        type='tel'
        inputMode='numeric'
        value={selectedCountry}
        onChange={onPhoneChange}
        country={selectedCountry}
        international
        ref={ref}
      />

      {isOpen && (
        <div
          className='cb-phone-input-field-selection'
          ref={selectionRef}
        >
          {countries.map(option => {
            const Flag = flags[option];

            return (
              <div
                key={option}
                className={`cb-phone-input-field-selection-item${option === selectedCountry ? ' cb-phone-input-field-selection-item-selected' : ''}`}
                onClick={() => handleOptionClick(option)}
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
});

export default PhoneInputField;
