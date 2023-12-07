import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import { notANumberRegex, numberRegex } from '../utils/validations';
import { Input } from './Input';

interface Props {
  numberOfDigits?: number;
  loading?: boolean;
  emittedOTP(otp: string[]): void;
}

export const OtpInputGroup: FC<Props> = ({ emittedOTP, numberOfDigits = 6, loading = false }) => {
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    emittedOTP(otp);
  }, [otp]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (notANumberRegex.test(value)) {
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
      }
    } else {
      setOtp(otp.map((d, idx) => (idx === index ? value : d)));

      if (newIndex < otp.length && value) {
        inputRefs.current[newIndex].focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
        break;
      case 'ArrowRight':
        if (index < otp.length - 1) {
          inputRefs.current[index + 1].focus();
        }
        break;
      case 'Backspace':
        if (otp[index]) {
          setOtp(otp.map((d, idx) => (idx === index ? '' : d)));
        } else if (index > 0) {
          inputRefs.current[index - 1].focus();
          setOtp(otp.map((d, idx) => (idx === index - 1 ? '' : d)));
        }
        break;
      default:
        break;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasteData.every(d => numberRegex.test(d))) {
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
            ref={el => el && (inputRefs.current[index] = el)}
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
