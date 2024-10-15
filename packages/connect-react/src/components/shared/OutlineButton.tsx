import React, { forwardRef } from 'react';

import type { ButtonProps } from './Button';
import { Button } from './Button';

export const OutlineButton = forwardRef<HTMLButtonElement, ButtonProps>(({ className, children, ...rest }, ref) => {
  return (
    <Button
      className={`cb-outline-button ${className ? ` ${className}` : ''}`}
      ref={ref}
      children={children}
      {...rest}
    />
  );
});
