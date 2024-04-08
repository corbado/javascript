import React from 'react';

export interface SpinnerProps {
  className?: string;
}

export const LoadingSpinner: React.FC<SpinnerProps> = ({ className = '' }) => {
  const customClass = `cb-spinner ${className}`;

  return <div className={customClass}></div>;
};
