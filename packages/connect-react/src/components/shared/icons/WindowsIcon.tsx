import type { InputHTMLAttributes } from 'react';
import React from 'react';

export const WindowsIcon = ({ className }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 4875 4875'
      className={className}
    >
      <path
        d='M0 0h2311v2310H0zm2564 0h2311v2310H2564zM0 2564h2311v2311H0zm2564 0h2311v2311H2564'
        fill='currentColor'
      />
    </svg>
  );
};
