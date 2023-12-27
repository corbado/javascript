import React, { type FocusEvent } from 'react';

import { Input, type InputProps } from './Input';

interface Props extends InputProps {
  label: string;
}

export const FormInput = ({
  label,
  type,
  id,
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  ...rest
}: Omit<Props, 'ref'>) => {
  const [focused, setFocused] = React.useState(false);

  const onFocusClick = (event: FocusEvent<HTMLInputElement, Element>) => {
    setFocused(true);

    if (onFocus) {
      onFocus(event);
    }
  };
  const onBlurClick = (event: FocusEvent<HTMLInputElement, Element>) => {
    setFocused(false);

    if (onBlur) {
      onBlur(event);
    }
  };

  const classes = `cb-form-input ${focused ? 'cb-has-focus' : ''} ${value ? 'cb-has-content' : ''} ${
    error ? 'cb-has-error' : ''
  }`;

  return (
    <>
      <div className={classes}>
        <Input
          type={type}
          id={id || name}
          name={name}
          value={value}
          placeholder={label}
          onChange={onChange}
          onFocus={onFocusClick}
          onBlur={onBlurClick}
          error={error}
          {...rest}
        />
        <label htmlFor={id || name}>{label}</label>
        {error ? (
          <div className='cb-form-input-error'>
            <p className='cb-error'>{error}</p>
          </div>
        ) : null}
      </div>
    </>
  );
};
