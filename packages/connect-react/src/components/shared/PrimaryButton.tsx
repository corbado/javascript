import { forwardRef } from 'react';
import React from 'react';

import type { ButtonProps } from './Button';
import { Button } from './Button';

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, ...rest }, ref) => {
  return (
    <Button
      className={`cb-primary-button ${className ? ` ${className}` : ''}`}
      ref={ref}
      children={children}
      {...rest}
    />
  );
});
