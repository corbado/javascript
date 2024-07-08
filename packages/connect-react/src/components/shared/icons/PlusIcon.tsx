import type { InputHTMLAttributes } from 'react';
import React from 'react';

export const PlusIcon = ({ className }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <svg
      className={className}
      viewBox='0 0 11 10'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M6.34046 4.23644V0.416992H4.6599V4.23644H0.458496V5.76421H4.6599V9.58366H6.34046V5.76421H10.5418V4.23644H6.34046Z'
        fill='currentColor'
      />
    </svg>
  );
};
