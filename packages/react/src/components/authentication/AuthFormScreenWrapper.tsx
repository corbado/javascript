import type { FC, FormEvent, ReactNode } from 'react';
import React from 'react';

import type { CustomizableComponent } from '../../types/common';
import { PrimaryButton } from '../ui/buttons/Button';

export interface AuthFormScreenWrapperProps extends CustomizableComponent {
  submitButtonText: ReactNode;
  disableSubmitButton?: boolean;
  loading: boolean;
  onSubmit: () => void;
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
      <PrimaryButton
        disabled={disableSubmitButton}
        isLoading={loading}
      >
        {submitButtonText}
      </PrimaryButton>
    </form>
  );
};

export default AuthFormScreenWrapper;
