import { forwardRef } from 'react';
import React from 'react';

import { Input } from './Input';

interface OtpInputProps {
  index: number;
  value: string;
  disabled?: boolean;
  hasError?: boolean;
  handleOtpChange: (element: HTMLInputElement, index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

export const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
  ({ index, value, disabled, hasError, handleOtpChange, handleKeyDown, handlePaste }, ref) => {
    return (
      <Input
        ref={ref}
        id={`otp-${index}`}
        value={value}
        type='tel'
        inputMode='numeric'
        pattern='[0-9]*'
        maxLength={1}
        onChange={e => handleOtpChange(e.target, index)}
        onKeyDown={e => handleKeyDown(e, index)}
        onPaste={handlePaste}
        disabled={disabled}
        className='cb-otp-input-2'
        autoFocus={index === 0}
        hasError={hasError}
      />
    );
  },
);
