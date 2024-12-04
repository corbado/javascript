import type { InputHTMLAttributes } from 'react';
import React from 'react';

export const SuccessIcon = ({ className }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <svg
      viewBox='0 0 74 75'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M37 0.5C16.65 0.5 0 17.15 0 37.5C0 57.85 16.65 74.5 37 74.5C57.35 74.5 74 57.85 74 37.5C74 17.15 57.35 0.5 37 0.5ZM52.54 31.21L34.78 48.97C33.3 50.45 31.08 50.45 29.6 48.97L21.46 40.83C19.98 39.35 19.98 37.13 21.46 35.65C22.94 34.17 25.16 34.17 26.64 35.65L32.19 41.2L47.36 26.03C48.84 24.55 51.06 24.55 52.54 26.03C54.02 27.51 54.02 29.73 52.54 31.21Z'
        fill='currentColor'
      />
    </svg>
  );
};
