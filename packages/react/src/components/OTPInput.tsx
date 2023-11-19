import React from 'react';

import Input from './Input';

interface Props {
  length?: number;
  loading?: boolean;
  value?: string[];

  emittedOTP(otp: string[]): void;
}

let currentOTPIndex = 0;

const OTPInput: React.FC<Props> = ({length = 6, emittedOTP, value, loading = false}) => {
  const [otps, setOtp] = React.useState<string[]>(new Array(length).fill(''));
  const [activeOtpIndex, setActiveOtpindex] = React.useState<number>(0);

  const inputRef = React.createRef<HTMLInputElement>();

  const getOnlyLengthCharacters = (text = '') => text.substring(0, length);

  const handlePaste = (text: string) => {
    const formattedOTP = Array.from({length}, (_, k) => getOnlyLengthCharacters(text)[k] || '');
    setActiveOtpindex(text.length);
    currentOTPIndex = text.length - 1;
    emittedOTP(formattedOTP);
    setOtp(formattedOTP);
  };

  const handleChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
    if (value.length > 2) {
      return handlePaste(value);
    }
    const newOtp: string[] = [...otps];
    newOtp[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) {
      setActiveOtpindex(currentOTPIndex - 1);
    } else {
      setActiveOtpindex(currentOTPIndex + 1);
    }

    setOtp(newOtp);
    emittedOTP(newOtp);
  };

  const handleKeyDown = ({key}: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    currentOTPIndex = index;
    if (key === 'Backspace') {
      setActiveOtpindex(currentOTPIndex - 1);
    }
  };

  React.useEffect(() => {
    if (value?.length) {
      setOtp(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [activeOtpIndex, loading]);

  return (
    <div className="grid grid-cols-6 gap-2 mt-4">
      {otps.map((_, index) => {
        return (
          <Input
            key={index}
            ref={index === activeOtpIndex ? inputRef : null}
            id={`otp${index}`}
            value={otps[index]}
            maxLength={1}
            onChange={handleChange}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, index)}
            disabled={loading}
            className='text-center px-0'
          />
        );
      })}
    </div>
  );
};

export default OTPInput;
