import React from 'react';

export interface SpinnerProps {
  variant?: 'primary' | 'on-primary';
  className?: string;
}

export const LoadingSpinner: React.FC<SpinnerProps> = ({ variant = 'primary', className }: SpinnerProps) => {
  return <div className={`loader loader-${variant} ${className}`}></div>;
};
