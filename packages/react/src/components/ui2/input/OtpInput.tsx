import { forwardRef } from 'react';
import React from 'react';

import { Input } from './Input';

interface OtpInputProps {
  index: number;
  value: string;
  disabled?: boolean;
  error?: string;
  handleOtpChange: (element: HTMLInputElement, index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

export const OtpInput = forwardRef<HTMLInputElement, OtpInputProps>(
  ({ index, value, disabled, error, handleOtpChange, handleKeyDown, handlePaste }, ref) => {
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
        className='cb-email-otp-input-2'
        autoFocus={index === 0}
        hasError={!!error}
      />
    );
  },
);
