import { FC, useEffect, useRef, useState } from 'react';
import flags from 'react-phone-number-input/flags';
import PhoneInput, { getCountries, getCountryCallingCode, Country } from 'react-phone-number-input/input';
import en from 'react-phone-number-input/locale/en.json';
import './temp.css';

interface CountrySelectProps {
  onChange: (value: Country) => void;
}

const options = getCountries();

const CountrySelect: FC<CountrySelectProps> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Country>('US');
  const selectionRef = useRef<HTMLDivElement>(null);
  const Flag = flags[selectedOption];

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
    setSelectedOption(option);
    setIsOpen(false);
  };

  const onPhoneChange = (value: Country) => {
    onChange(value);
  };

  return (
    <div className='cb-phone-input-field'>
      <button
        className='cb-phone-input-field-button'
        onClick={toggleDropdown}
      >
        {Flag && <Flag title={selectedOption} />} <div>+{getCountryCallingCode(selectedOption)}</div>
      </button>

      {isOpen && (
        <div
          className='cb-phone-input-field-selection'
          ref={selectionRef}
        >
          {options.map(option => {
            const Flag = flags[option];

            return (
              <div
                key={option}
                className={`cb-phone-input-field-selection-item${option === selectedOption ? ' cb-phone-input-field-selection-item-selected' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {Flag && <Flag title={option} />}
                {en[option]} (+{getCountryCallingCode(option)})
              </div>
            );
          })}
        </div>
      )}
      <PhoneInput
        className='cb-phone-input-field-input'
        placeholder=''
        value={selectedOption}
        onChange={onPhoneChange}
        country={selectedOption}
        international
      />
    </div>
  );
};

export default CountrySelect;
