import React, { type ButtonHTMLAttributes, forwardRef } from 'react';

import { LoadingSpinner } from './LoadingSpinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading = false, disabled, children, ...rest }, ref) => {
    return (
      <button
        style={{ position: 'relative' }}
        disabled={isLoading || disabled}
        ref={ref}
        {...rest}
      >
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'inherit',
            }}
          >
            <LoadingSpinner variant='on-primary' />
          </div>
        )}
        {children}
      </button>
    );
  },
);
