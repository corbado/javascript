import type { FC, FormEventHandler, ReactNode } from 'react';
import React from 'react';

import type { CustomizableComponent } from '../types/common';
import { Button } from './Button';

export interface AuthFormScreenWrapperProps extends CustomizableComponent {
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitButtonText: ReactNode;
  disableSubmitButton?: boolean;
}

export const AuthFormScreenWrapper: FC<AuthFormScreenWrapperProps> = ({
  children,
  onSubmit,
  submitButtonText,
  disableSubmitButton,
}) => {
  return (
    <form
      className='cb-form'
      onSubmit={onSubmit}
    >
      <div className='cb-form-body'>{children}</div>
      <Button
        variant='primary'
        className='cb-form-button'
        disabled={disableSubmitButton}
      >
        {submitButtonText}
      </Button>
    </form>
  );
};

export default AuthFormScreenWrapper;
