import { notANumberRegex, numberRegex } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { memo, useCallback, useRef, useState } from 'react';

import ErrorMessage from '../errors/ErrorMessage';
import { OtpInput } from './OtpInput';

interface Props {
  numberOfDigits?: number;
  loading?: boolean;
  emittedOTP(otp: string[]): void;
  error?: string;
}

export const OtpInputGroup: FC<Props> = memo(({ emittedOTP, numberOfDigits = 6, loading = false, error }) => {
  const [otpState, setOtpState] = useState(new Array<string>(numberOfDigits).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const otpRef = useRef(new Array<string>(numberOfDigits).fill(''));

  const updateOtp = useCallback(
    (otp: string[]) => {
      otpRef.current = otp;
      emittedOTP(otp);
      setOtpState(otp);
    },
    [emittedOTP],
  );

  const handleOtpChange = useCallback(
    (element: HTMLInputElement, index: number) => {
      const value = element.value;
      if (notANumberRegex.test(value)) {
        return;
      }

      const newIndex = index + 1;
      const otp = otpRef.current;

      if (otp[index]) {
        if (newIndex >= otp.length) {
          return;
        }

        updateOtp(otp.map((d, idx) => (idx === newIndex ? value : d)));

        if (newIndex + 1 < otp.length) {
          inputRefs.current[newIndex + 1].focus();
        }
      } else {
        updateOtp(otp.map((d, idx) => (idx === index ? value : d)));

        if (newIndex < otp.length && value) {
          inputRefs.current[newIndex].focus();
        }
      }
    },
    [updateOtp],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const otp = otpRef.current;

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
            updateOtp(otp.map((d, idx) => (idx === index ? '' : d)));
          } else if (index > 0) {
            inputRefs.current[index - 1].focus();
            updateOtp(otp.map((d, idx) => (idx === index - 1 ? '' : d)));
          }
          break;
        default:
          break;
      }
    },
    [updateOtp],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();

      const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');

      if (pasteData.every(d => numberRegex.test(d))) {
        updateOtp(pasteData.concat(new Array(6 - pasteData.length).fill('')));
        inputRefs.current[pasteData.length - 1].focus();
      }
    },
    [updateOtp],
  );

  return (
    <>
      <div className='cb-email-otp-input-container-2'>
        {otpState.map((data, index) => (
          <OtpInput
            key={index}
            index={index}
            value={data}
            handleOtpChange={handleOtpChange}
            handleKeyDown={handleKeyDown}
            handlePaste={handlePaste}
            ref={el => el && (inputRefs.current[index] = el)}
            disabled={loading}
            error={error}
          />
        ))}
      </div>
      {error && <ErrorMessage message={error} />}
    </>
  );
});
