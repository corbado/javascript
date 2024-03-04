import React from 'react';

export interface SpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<SpinnerProps> = ({ className = '' }) => {
  const customClass = `cb-spinner-2 ${className}`;

  return <div className={customClass}></div>;
};
