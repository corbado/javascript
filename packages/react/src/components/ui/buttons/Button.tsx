import React from 'react';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

import { LoadingSpinner } from '../LoadingSpinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  spinnerClassName?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading = false, spinnerClassName, disabled, children, ...rest }, ref) => {
    return (
      <button
        disabled={isLoading || disabled}
        ref={ref}
        {...rest}
      >
        {isLoading ? <LoadingSpinner className={spinnerClassName} /> : children}
      </button>
    );
  },
);
