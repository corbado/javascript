import { FlowHandlerEvents } from '@corbado/shared-ui';
import type { RecoverableError } from '@corbado/web-core';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthFormScreen, FormInput } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const Start = () => {
  const { currentUserState, emitEvent } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authentication.signup.start` });
  const [emailError, setEmailError] = useState<RecoverableError | null>(null);
  const [userNameError, setUserNameError] = useState<RecoverableError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const emailRef = useRef<HTMLInputElement>();
  const fullNameRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setLoading(false);
    setEmailError(currentUserState.emailError ?? null);
    setUserNameError(currentUserState.userNameError ?? null);
  }, [currentUserState]);

  const headerText = useMemo(() => t('header'), [t]);
  const subHeaderText = useMemo(() => t('subheader'), [t]);
  const flowChangeButtonText = useMemo(() => t('button_login'), [t]);
  const submitButtonText = useMemo(() => t('button_submit'), [t]);
  const nameFieldLabel = useMemo(() => t('textField_name'), [t]);
  const emailFieldLabel = useMemo(() => t('textField_email'), [t]);

  const handleSubmit = useCallback(() => {
    setLoading(true);
    void emitEvent(FlowHandlerEvents.PrimaryButton, {
      userStateUpdate: { email: emailRef.current?.value, fullName: fullNameRef.current?.value },
    });
  }, [emitEvent]);

  return (
    <>
      <AuthFormScreen
        headerText={headerText}
        subHeaderText={subHeaderText}
        flowChangeButtonText={flowChangeButtonText}
        onSubmit={handleSubmit}
        submitButtonText={submitButtonText}
        loading={loading}
      >
        <FormInput
          name='fullName'
          label={nameFieldLabel}
          error={userNameError?.translatedMessage}
          ref={el => el && (fullNameRef.current = el)}
        />
        <FormInput
          name='name'
          type='email'
          autoComplete='email'
          label={emailFieldLabel}
          error={emailError?.translatedMessage}
          ref={el => el && (emailRef.current = el)}
        />
      </AuthFormScreen>
    </>
  );
};
