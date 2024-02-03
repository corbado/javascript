import type { FC, FormEvent, ReactNode } from 'react';
import React, { memo } from 'react';

import useFlowHandler from '../../hooks/useFlowHandler';
import type { CustomizableComponent } from '../../types/common';
import { Header, SubHeader } from '../ui';
import { PrimaryButton } from '../ui/buttons/Button';

export interface AuthFormScreenProps extends CustomizableComponent {
  headerText: string;
  subHeaderText: string;
  flowChangeButtonText?: string;
  submitButtonText: ReactNode;
  loading: boolean;
  onSubmit: () => void;
}

export const AuthFormScreen: FC<AuthFormScreenProps> = memo(
  ({ children, headerText, subHeaderText, flowChangeButtonText, submitButtonText, loading, onSubmit }) => {
    const { changeFlow } = useFlowHandler();
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      onSubmit();
    };
    return (
      <>
        <Header>{headerText}</Header>

        {flowChangeButtonText ? (
          <SubHeader>
            {subHeaderText}
            <span
              className='cb-link-secondary'
              onClick={changeFlow}
            >
              {flowChangeButtonText}
            </span>
          </SubHeader>
        ) : null}

        <form
          className='cb-form'
          onSubmit={handleSubmit}
        >
          <div className='cb-form-body'>{children}</div>
          <PrimaryButton
            disabled={loading}
            isLoading={loading}
          >
            {submitButtonText}
          </PrimaryButton>
        </form>
      </>
    );
  },
);

export default AuthFormScreen;
