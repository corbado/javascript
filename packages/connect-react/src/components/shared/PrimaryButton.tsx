import React, { forwardRef } from 'react';

import type { ButtonProps } from './Button';
import { Button } from './Button';

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, onClick, ...rest }, ref) => {
    return (
      <Button
        className={`cb-primary-button ${className ? ` ${className}` : ''}`}
        ref={ref}
        children={children}
        onClick={e => {
          e.preventDefault();
          onClick?.(e);
        }}
        {...rest}
      />
    );
  },
);
