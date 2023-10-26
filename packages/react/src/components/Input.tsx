import React from 'react';

export interface Props
    extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    id?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
    ({ id, className, ...props }, ref) => {
        return (
            <div className="input-wrapper">
                <input
                    id={id}
                    {...props}
                    className={className}
                    autoComplete="off"
                    ref={ref}
                />
            </div>
        );
    },
);

export default Input;