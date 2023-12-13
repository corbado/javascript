import type { FC, FormEvent, ReactNode } from 'react';
import React from 'react';

import type { CustomizableComponent } from '../types/common';
import { Button } from './Button';

export interface AuthFormScreenWrapperProps extends CustomizableComponent {
  onSubmit: () => void;
  submitButtonText: ReactNode;
  disableSubmitButton?: boolean;
  loading: boolean;
}

export const AuthFormScreenWrapper: FC<AuthFormScreenWrapperProps> = ({
  children,
  onSubmit,
  submitButtonText,
  disableSubmitButton,
  loading = false,
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit();
  };
  return (
    <form
      className='cb-form'
      onSubmit={handleSubmit}
    >
      <div className='cb-form-body'>{children}</div>
      <Button
        variant='primary'
        className='cb-form-button'
        disabled={disableSubmitButton}
        isLoading={loading}
      >
        {submitButtonText}
      </Button>
    </form>
  );
};

export default AuthFormScreenWrapper;
