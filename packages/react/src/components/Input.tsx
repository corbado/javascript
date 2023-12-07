import React from 'react';

export interface InputProps
  extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ id, className = '', error, ...props }, ref) => {
  const _classnames = `cb-input ${className} ${error ? 'cb-error' : ''}`;

  return (
    <input
      id={id}
      {...props}
      className={_classnames}
      autoComplete={props.autoComplete ? props.autoComplete : 'off'}
      ref={ref}
    />
  );
});
