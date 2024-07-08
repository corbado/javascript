import type { InputHTMLAttributes } from 'react';
import React from 'react';

export const ShieldTickIcon = ({ className }: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <svg
      viewBox='0 0 9 10'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path
        d='M8.2192 0.830078H1.41069C1.25268 0.830078 1.10115 0.892844 0.989431 1.00457C0.877707 1.11629 0.814941 1.26782 0.814941 1.42582V3.8088C0.814941 6.01901 1.88388 7.35774 2.7809 8.09136C3.74813 8.88284 4.70728 9.1505 4.74771 9.16157C4.79173 9.17358 4.83816 9.17358 4.88218 9.16157C4.9226 9.1505 5.88175 8.88284 6.84898 8.09136C7.74601 7.35774 8.81494 6.01901 8.81494 3.8088V1.42582C8.81494 1.26782 8.75218 1.11629 8.64045 1.00457C8.52873 0.892844 8.3772 0.830078 8.2192 0.830078ZM8.3043 3.8088C8.3043 5.41561 7.71111 6.71902 6.5409 7.6837C6.02754 8.10525 5.44305 8.43179 4.81494 8.64795C4.18674 8.43199 3.60222 8.10543 3.08898 7.6837C1.91877 6.71902 1.32558 5.41561 1.32558 3.8088V1.42582C1.32558 1.40325 1.33455 1.3816 1.35051 1.36564C1.36647 1.34968 1.38811 1.34072 1.41069 1.34072H8.2192C8.24177 1.34072 8.26342 1.34968 8.27938 1.36564C8.29534 1.3816 8.3043 1.40325 8.3043 1.42582V3.8088ZM6.69749 3.28795C6.74531 3.33582 6.77216 3.40072 6.77216 3.46838C6.77216 3.53604 6.74531 3.60093 6.69749 3.6488L4.31452 6.03178C4.26664 6.07959 4.20175 6.10645 4.13409 6.10645C4.06643 6.10645 4.00154 6.07959 3.95367 6.03178L2.93239 5.0105C2.88729 4.9621 2.86274 4.89809 2.8639 4.83194C2.86507 4.7658 2.89187 4.70269 2.93864 4.65591C2.98542 4.60913 3.04853 4.58233 3.11468 4.58117C3.18082 4.58 3.24484 4.60455 3.29324 4.64965L4.13409 5.49008L6.33664 3.28795C6.38452 3.24014 6.44941 3.21328 6.51707 3.21328C6.58473 3.21328 6.64962 3.24014 6.69749 3.28795Z'
        fill='currentColor'
      />
    </svg>
  );
};