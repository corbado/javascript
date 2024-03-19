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
        className={`cb-primary-button cb-text-2${colorVariant === 'error' ? ` cb-primary-button-error-variant` : ''}${className ? ` ${className}` : ''}`}
        spinnerClassName='cb-primary-button-spinner'
        ref={ref}
        children={children}
        {...rest}
      />
    );
  },
);
