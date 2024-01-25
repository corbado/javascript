import React from 'react';

interface Props {
  onClick: (value: string) => void;
  text: string;
  value: string | number;
  currentValue: string | number;
}

const RadioButton: React.FC<Props> = ({ text, value, currentValue, onClick }) => {
  return (
    <label className='inline-flex items-center'>
      <input
        type='radio'
        className='form-radio'
        checked={value === currentValue}
        name={text}
        value={value}
        onChange={event => onClick(event.target.value)}
      />
      <span className='ml-2'>{text}</span>
    </label>
  );
};

export default RadioButton;
