import React from 'react';

export interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  id?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, Props>(({ id, className, error, ...props }, ref) => {
  const _classnames = `${className} ${error ? '!border-error-color' : ''}`;
  return (
    <div className='input-wrapper'>
      <input
        id={id}
        {...props}
        className={_classnames}
        autoComplete='off'
        ref={ref}
      />
    </div>
  );
});
