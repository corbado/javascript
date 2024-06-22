import { forwardRef } from 'react';
import React from 'react';

import type { ButtonProps } from './Button';
import { Button } from './Button';

export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, ...rest }, ref) => {
  return (
    <Button
      className={`cb-secondary-button ${className ? ` ${className}` : ''}`}
      ref={ref}
      children={children}
      {...rest}
    />
  );
});
