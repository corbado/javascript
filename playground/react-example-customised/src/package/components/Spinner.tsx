import React, { memo } from 'react';

export interface SpinnerProps {
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = memo(
  ({ variant = 'primary', className = '' }) => {
    const customClass = `${variant === 'primary' ? 'cb-spinner-primary' : 'cb-spinner-secondary'} ${className}`;

    return <div className={customClass}></div>;
  },
  (prevProps, nextProps) => prevProps.variant === nextProps.variant && prevProps.className === nextProps.className,
);
