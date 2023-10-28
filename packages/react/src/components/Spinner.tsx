import React from 'react';

interface Props {
    variant?: 'primary' | 'secondary';
}

export const Spinner: React.FC<Props> = ({ variant = 'primary' }) => {
    const className = variant === 'primary' ? 'spinner-primary' : 'spinner-secondary';
  return (
    <div className={className}></div>
  )
}
