import React from 'react';

import Input, { type Props as InputProps } from './Input';

interface Props extends InputProps {
  label: string;
}

const LabelledInput = ({ label, type, id, name, value, onChange, error, ref, ...rest }: Props) => {
  const [focused, setFocused] = React.useState(false);

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const classes = `floating-label ${focused ? 'has-focus' : ''} ${value ? 'has-content' : ''}`;

  return (
    <>
      <div className={classes}>
        <Input
          type={type}
          id={id || name}
          name={name}
          placeholder={label}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          error={error}
          {...rest}
        />
        <label
          htmlFor={id}
        >
          {label}
        </label>
        <div className="h-5">
        {error && <p className='error-text'>{error}</p>}
      </div>
      </div>
    </>
  );
};

export default LabelledInput;