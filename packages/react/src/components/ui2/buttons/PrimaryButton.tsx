import { forwardRef } from 'react';
import React from 'react';

import { Button, type ButtonProps } from './Button';

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, ...rest }, ref) => {
  return (
    <Button
      className={`cb-primary-button-2 cb-text-3-2 ${className}`}
      spinnerClassName='cb-primary-button-spinner-2'
      ref={ref}
      children={children}
      {...rest}
    />
  );
});
