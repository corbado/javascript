import React, { type FocusEvent } from 'react';

import { Input, type Props as InputProps } from './Input';

interface Props extends InputProps {
  label: string;
}

export const LabelledInput = ({
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

  const classes = `floating-label ${focused ? 'has-focus' : ''} ${value ? 'has-content' : ''}`;

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
        <label htmlFor={id}>{label}</label>
        {error ? (
          <div className='h-5'>
            <p className='error-text'>{error}</p>
          </div>
        ) : (
          <div className='h-1'></div>
        )}
      </div>
    </>
  );
};
