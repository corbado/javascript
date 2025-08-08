'use client';

import React, { useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';

type Props = {
  onSubmit: (value: string) => Promise<string | undefined>;
  onCancel?: () => void;
  onAutoFill?: () => Promise<string | undefined>;
};

export const ConfirmOTP = ({ onSubmit, onCancel, onAutoFill }: Props) => {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('Enter your code');

  const onChange = async (value: string) => {
    if (value.length === 6) {
      setValue(value);
      setMessage('Loading...');
      const maybeError = await onSubmit(value);
      if (maybeError) {
        setMessage(maybeError);
      }
    } else {
      setValue(value);
    }
  };

  return (
    // center the OTP input
    <div className='space-y-2'>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={onChange}
      >
        <div className='flex justify-center w-full'>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </div>
      </InputOTP>
      <div className='text-center text-sm'>{message}</div>
      {onAutoFill && (
        <div className='text-center mt-4'>
          <Button
            variant='default'
            className='w-40'
            onClick={async () => {
              const code = await onAutoFill();
              if (!code) {
                return;
              }

              setValue(code);
              await onChange(code);
            }}
          >
            AutoFill
          </Button>
        </div>
      )}
      {onCancel && (
        <div className='text-center mt-4'>
          <Button
            variant='ghost'
            className='w-40'
            onClick={onCancel}
          >
            Back
          </Button>
        </div>
      )}
    </div>
  );
};

export default ConfirmOTP;
