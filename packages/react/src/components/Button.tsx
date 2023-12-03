import type { ButtonHTMLAttributes, FunctionComponent } from 'react';
import React from 'react';

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

export const Button: FunctionComponent<ButtonProps> = ({
  variant = 'tertiary',
  fullWidth = true,
  isLoading = false,
  className = '',
  disabled,
  children,
  ...rest
}) => {
  const classes = `${variants[variant]} ${className} ${fullWidth ? 'w-full' : ''}`;
  return (
    <button
      className={classes}
      disabled={disabled}
      {...rest}
    >
      {isLoading ? <Spinner /> : children}
    </button>
  );
};
