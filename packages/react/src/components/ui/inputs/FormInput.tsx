import React, { type FocusEvent } from 'react';

import { Input, type InputProps } from './Input';

interface Props extends InputProps {
  label: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, type, id, name, value, onChange, onFocus, onBlur, error, ...rest }: Omit<Props, 'ref'>, ref) => {
    const [focused, setFocused] = React.useState(false);
    const [isDirty, setIsDirty] = React.useState(false);

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

    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsDirty(!!event.target.value);

      if (onChange) {
        onChange(event);
      }
    };

    const classes = `cb-form-input ${focused ? 'cb-has-focus' : ''} ${isDirty ? 'cb-has-content' : ''} ${
      error ? 'cb-has-error' : ''
    }`;

    return (
      <>
        <div className={classes}>
          <Input
            ref={ref}
            type={type}
            id={id || name}
            name={name}
            value={value}
            placeholder={label}
            onChange={onInputChange}
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
  },
);
