import type { InputHTMLAttributes } from 'react';
import React from 'react';

export const ArrowRight = ({ className }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <svg
      viewBox='0 0 9 16'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M1.66778 15.227C1.35792 15.5368 0.854851 15.5346 0.547741 15.222C0.244451 14.9133 0.246643 14.4178 0.552653 14.1118L6.06263 8.60184C6.45315 8.21132 6.45315 7.57815 6.06263 7.18763L0.552653 1.67765C0.246643 1.37164 0.244451 0.876184 0.547741 0.567478C0.854851 0.254884 1.35792 0.252658 1.66778 0.562522L8.29289 7.18763C8.68342 7.57815 8.68342 8.21132 8.29289 8.60184L1.66778 15.227Z'
        fill='currentColor'
      />
    </svg>
  );
};
