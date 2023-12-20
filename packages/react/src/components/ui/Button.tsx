import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import { Spinner } from './Spinner';

type ButtonVariants = 'primary' | 'secondary' | 'tertiary' | 'close';
interface AdditionalProps {
  variant?: ButtonVariants;
  isLoading?: boolean;
}
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & AdditionalProps;

const variants: Record<ButtonVariants, string> = {
  primary: 'cb-button-primary',
  secondary: 'cb-button-secondary',
  tertiary: 'cb-button-tertiary',
  close: 'cb-button-primary cb-button-close',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'tertiary', isLoading = false, className = '', disabled, children, ...rest }, ref) => {
    const classes = `${variants[variant]} ${className}`;
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
