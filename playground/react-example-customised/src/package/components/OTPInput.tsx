import React, { FC, useEffect, useRef, useState } from 'react';

import { Input } from './Input';

interface Props {
  numberOfDigits?: number;
  loading?: boolean;
  emittedOTP(otp: string[]): void;
}

export const OTPInput: FC<Props> = ({ emittedOTP, numberOfDigits = 6, loading = false }) => {
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    emittedOTP(otp);
  }, [otp]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (/^[^0-9]$/.test(value)) {
      return;
    }

    const newIndex = index + 1;

    if (otp[index]) {
      if (newIndex >= otp.length) {
        return;
      }

      setOtp(otp.map((d, idx) => (idx === newIndex ? value : d)));

      if (newIndex + 1 < otp.length) {
        inputRefs.current[newIndex + 1].focus();
      } else {
        inputRefs.current[index].blur();
      }
    } else {
      setOtp(otp.map((d, idx) => (idx === index ? value : d)));

      if (newIndex < otp.length && value) {
        inputRefs.current[newIndex].focus();
      } else {
        inputRefs.current[index].blur();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        setOtp(otp.map((val, idx) => (index === idx ? '' : val)));
      } else if (index > 0) {
        inputRefs.current[index - 1].focus();
        setOtp(otp.map((val, idx) => (index - 1 === idx ? '' : val)));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasteData.every(d => /^[0-9]$/.test(d))) {
      setOtp(pasteData.concat(new Array(6 - pasteData.length).fill('')));
      inputRefs.current[pasteData.length - 1].focus();
    }
  };

  return (
    <div className='cb-email-otp-input-container'>
      {otp.map((data, index) => {
        return (
          <Input
            key={index}
            ref={el => (inputRefs.current[index] = el!)}
            id={`otp-${index}`}
            value={data}
            type='text'
            maxLength={1}
            onChange={e => handleOtpChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onPaste={handlePaste}
            disabled={loading}
            className='cb-email-otp-input'
          />
        );
      })}
    </div>
  );
};
