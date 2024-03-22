// import React, { ChangeEvent, ElementType, FC, forwardRef, useCallback, useMemo } from 'react';
// import { useEffect, useRef, useState } from 'react';
// import { EmbeddedFlagProps } from 'react-phone-number-input';
// import flags from 'react-phone-number-input/flags';
// import type { Country } from 'react-phone-number-input/input';
// import PhoneInput, { getCountryCallingCode } from 'react-phone-number-input/input';
// import en from 'react-phone-number-input/locale/en.json';

// interface PhoneInputProps {
//   hasError?: boolean;
//   className?: string;
//   onChange: (value: Country) => void;
// }
// interface CountryOption {
//   value: Country;
//   label: string;
//   divider?: boolean;
// }

// interface CountrySelectProps {
//   unicodeFlags?: boolean;
//   disabled?: boolean;
//   readOnly?: boolean;
//   className?: string;
//   value?: Country;
//   options: CountryOption[];
//   iconComponent?: ElementType<{ country: Country; label: string }>;
//   arrowComponent?: ElementType;
//   onChange: (value: Country) => void;
// }

// export const CountrySelectWithIcon: FC<CountrySelectProps> = ({
//   value,
//   options,
//   iconComponent: Icon,
//   disabled,
//   readOnly,
//   onChange,
//   ...rest
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const selectionRef = useRef<HTMLDivElement>(null);
//   const selectedOption = useMemo(() => {
//     return getSelectedOption(options, value);
//   }, [options, value]);

//   const onChange_ = useCallback(
//     (event: ChangeEvent<HTMLSelectElement>) => {
//       const value = event.target.value as Country;
//       onChange(value);
//     },
//     [onChange],
//   );

//   return (
//     <div className='phone-input-field-button'>
//       <select
//         {...rest}
//         className='phone-input-field-selection'
//         disabled={disabled || readOnly}
//         value={value}
//         onChange={onChange_}
//       >
//         {options
//           .filter(({ value, divider }) => !divider && value)
//           .map(({ value: countryCode, label }) => (
//             <option
//               key={countryCode}
//               value={countryCode}
//               disabled={countryCode === value}
//               className={`phone-input-field-selection-item${countryCode === value ? ' phone-input-field-selection-item-selected' : ''}`}
//             >
//               {label} (+{getCountryCallingCode(countryCode) || ''})
//             </option>
//           ))}
//       </select>
//       {Icon && (
//         <Icon
//           country={value ?? 'US'}
//           label={(selectedOption && selectedOption.label) ?? ''}
//         />
//       )}
//     </div>
//   );
// };

// const countries = getCountries();

// const PhoneInputField = forwardRef<HTMLInputElement, PhoneInputProps>(({ className, hasError, onChange }, ref) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedCountry, setSelectedCountry] = useState<Country>('US');
//   const selectionRef = useRef<HTMLDivElement>(null);
//   const Flag = flags[selectedCountry];

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (selectionRef.current && !selectionRef.current.contains(event.target as Node)) {
//         setIsOpen(false);
//       }
//     }

//     function handleKeyDown(event: KeyboardEvent) {
//       if (event.key === 'Escape') {
//         setIsOpen(false);
//       }
//     }

//     document.addEventListener('mousedown', handleClickOutside);
//     document.addEventListener('keydown', handleKeyDown);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('keydown', handleKeyDown);
//     };
//   }, [selectionRef]);

//   const toggleDropdown = () => setIsOpen(!isOpen);
//   const handleOptionClick = (option: Country) => {
//     setSelectedCountry(option);
//     setIsOpen(false);
//   };

//   const onPhoneChange = (value: Country) => {
//     onChange(value);
//   };

//   return (
//     <div className={`cb-phone-input-field${hasError ? ' cb-input-error' : ''}${className ? ` ${className}` : ''}`}>
//       <button
//         type='button'
//         className='cb-phone-input-field-button'
//         onClick={toggleDropdown}
//       >
//         {Flag && <Flag title={selectedCountry} />}{' '}
//         <div>
//           <span className='cb-text-2'>+{getCountryCallingCode(selectedCountry)}</span>
//         </div>
//       </button>
//       <PhoneInput
//         className='cb-text-2 cb-phone-input-field-input'
//         placeholder=''
//         id='phone'
//         name='phone'
//         autoComplete='phone'
//         type='tel'
//         inputMode='numeric'
//         value={selectedCountry}
//         onChange={onPhoneChange}
//         country={selectedCountry}
//         international
//         ref={ref}
//       />

//       {isOpen && (
//         <div
//           className='cb-phone-input-field-selection'
//           ref={selectionRef}
//         >
//           {countries.map(option => {
//             const Flag = flags[option];

//             return (
//               <div
//                 key={option}
//                 className={`cb-phone-input-field-selection-item${option === selectedCountry ? ' cb-phone-input-field-selection-item-selected' : ''}`}
//                 onClick={() => handleOptionClick(option)}
//               >
//                 {Flag && <Flag title={option} />}
//                 <span className='cb-text-2'>
//                   {en[option]} (+{getCountryCallingCode(option)})
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// });

// function getSelectedOption(
//   options: CountryOption[],
//   value: Country | undefined,
// ): (CountryOption & { Flag: typeof flags.US }) | undefined {
//   if (!value) {
//     return undefined;
//   }
//   const selectedOption = options.find(option => option.value === value);

//   if (!selectedOption) {
//     return undefined;
//   }

//   const Flag = flags[value];

//   return {
//     ...selectedOption,
//     Flag,
//   };
// }

// export default PhoneInputField;

export default function PhoneField2() {
  return <div>PhoneField2</div>;
}
