import { forwardRef } from 'react';
import React from 'react';

import { Button, type ButtonProps } from './Button';

export interface PrimaryButtonProps extends ButtonProps {
  colorVariant?: 'default' | 'error';
}

export const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ colorVariant, className, children, ...rest }, ref) => {
    return (
      <Button
        className={`cb-primary-button-2 cb-text-2-2${colorVariant === 'error' ? ` cb-primary-button-error-variant-2` : ''}${className ? ` ${className}` : ''}`}
        spinnerClassName='cb-primary-button-spinner-2'
        ref={ref}
        children={children}
        {...rest}
      />
    );
  },
);
