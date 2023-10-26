import React from 'react';
import Input, { type Props as InputProps } from './Input';

interface Props extends InputProps {
  label: string;
}

const LabelledInput = ({ label, type, id, name, onChange }: Props) => {
  return (
    <div className="floating-label">
      <Input
        type={type}
        id={id}
        name={name}
        placeholder=""
        onChange={onChange}
      />
      <label
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};

export default LabelledInput;