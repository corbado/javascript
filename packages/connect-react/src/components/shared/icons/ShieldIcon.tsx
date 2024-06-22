import React, { InputHTMLAttributes } from 'react';

export const ShieldIcon = ({ className }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      enableBackground='new 0 0 24 24'
      className={className}
      viewBox='0 0 24 24'
    >
      <g>
        <path
          d='M0,0h24v24H0V0z'
          fill='none'
        />
      </g>
      <g>
        <path d='M12,2L4,5v6.09c0,5.05,3.41,9.76,8,10.91c4.59-1.15,8-5.86,8-10.91V5L12,2z M18,11.09c0,4-2.55,7.7-6,8.83 c-3.45-1.13-6-4.82-6-8.83V6.31l6-2.12l6,2.12V11.09z M8.82,10.59L7.4,12l3.54,3.54l5.66-5.66l-1.41-1.41l-4.24,4.24L8.82,10.59z' />
      </g>
    </svg>
  );
};
