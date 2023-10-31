import React from 'react';
import Input, { type Props as InputProps } from './Input';

interface Props extends InputProps {
  label: string;
}

const LabelledInput = ({ label, type, id, name, value, onChange, error }: Props) => {
  const [focused, setFocused] = React.useState(false);

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const classes = `floating-label ${focused ? 'has-focus' : ''} ${value ? 'has-content' : ''} ${error ? 'border-error-color' : ''}`;

  return (
    <div className={classes}>
      <Input
        type={type}
        id={id || name}
        name={name}
        placeholder={label}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
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