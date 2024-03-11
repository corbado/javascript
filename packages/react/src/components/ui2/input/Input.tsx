import type { InputHTMLAttributes } from 'react';
import React, { forwardRef } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputFieldProps>(({ id, hasError, className, ...props }, ref) => (
  <input
    {...props}
    id={id}
    className={`cb-text-2-2 cb-input-2${hasError ? ' cb-input-error-2' : ''}${className ? ` ${className}` : ''}`}
    ref={ref}
  />
));
