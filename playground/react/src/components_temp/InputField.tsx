import React from 'react';
import ErrorMessage from './ErrorMessage';

interface InputFieldProps {
  label: string;
  type?: string;
  id: string;
  errorMessage?: string;
  errorImgSrc?: string;
  errorImgAlt?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  id,
  errorMessage,
  errorImgSrc,
  errorImgAlt,
}) => (
  <>
    <label
      htmlFor={id}
      className='cb-label'
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      className='cb-input'
      aria-label={label}
    />
    {errorMessage && errorImgSrc && errorImgAlt && (
      <ErrorMessage
        altText={errorImgAlt}
        imgSrc={errorImgSrc}
        message={errorMessage}
      />
    )}
  </>
);

export default InputField;
