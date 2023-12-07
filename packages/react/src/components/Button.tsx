import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import { Spinner } from './Spinner';

interface AdditionalProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variants = {
  primary: 'cb-button-primary',
  secondary: 'cb-button-secondary',
  tertiary: 'cb-button-tertiary',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & AdditionalProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'tertiary', fullWidth = true, isLoading = false, className = '', disabled, children, ...rest }, ref) => {
    const classes = `${variants[variant]} ${className} ${fullWidth ? 'w-full' : ''}`;
    return (
      <button
        className={classes}
        disabled={disabled}
        ref={ref}
        {...rest}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  },
);
