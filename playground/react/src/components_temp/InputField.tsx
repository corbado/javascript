import React from 'react';
import ErrorMessage from './ErrorMessage';

interface InputFieldProps {
  label: string;
  type?: string;
  id: string;
  errorMessage?: string;
  showError?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, type = 'text', id, errorMessage, showError }) => (
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
      className={`cb-input ${showError ? 'cb-input-error' : ''}`}
      aria-label={label}
    />
    {showError && errorMessage && <ErrorMessage message={errorMessage} />}
  </>
);

export default InputField;
