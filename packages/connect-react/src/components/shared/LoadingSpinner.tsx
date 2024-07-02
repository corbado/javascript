import React from 'react';

export interface SpinnerProps {
  variant?: 'primary' | 'on-primary';
}

export const LoadingSpinner: React.FC<SpinnerProps> = ({ variant = 'primary' }: SpinnerProps) => {
  return <div className={`loader loader-${variant}`}></div>;
};
