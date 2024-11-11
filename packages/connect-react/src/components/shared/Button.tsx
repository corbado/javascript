import React, { type ButtonHTMLAttributes, forwardRef } from 'react';

import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading = false, disabled, children, onClick, ...rest }, ref) => {
    return (
      <button
        style={{ position: 'relative' }}
        disabled={isLoading || disabled}
        ref={ref}
        onClick={e => {
          e.preventDefault();
          if (isLoading) {
            return;
          }

          onClick?.(e);
        }}
        {...rest}
      >
        {isLoading && (
          <div className='button-loading-container'>
            <LoadingSpinner variant='on-primary' />
          </div>
        )}
        {children}
      </button>
    );
  },
);
