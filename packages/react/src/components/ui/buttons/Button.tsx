import type { ButtonHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

import { Spinner } from '../Spinner';

type ButtonVariants = 'primary' | 'secondary' | 'tertiary' | 'close';

interface AdditionalProps {
  variant?: ButtonVariants;
  isLoading?: boolean;
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & AdditionalProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading = false, disabled, children, ...rest }, ref) => {
    return (
      <button
        disabled={isLoading || disabled}
        ref={ref}
        {...rest}
      >
        {isLoading ? <Spinner /> : children}
      </button>
    );
  },
);

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading, disabled, children, ...rest }, ref) => {
    return (
      <Button
        className={'cb-button-primary'}
        isLoading={isLoading}
        disabled={disabled}
        ref={ref}
        children={children}
        {...rest}
      />
    );
  },
);

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ isLoading, disabled, children, ...rest }, ref) => {
    return (
      <Button
        className={'cb-button-secondary'}
        isLoading={isLoading}
        disabled={disabled}
        ref={ref}
        children={children}
        {...rest}
      />
    );
  },
);
