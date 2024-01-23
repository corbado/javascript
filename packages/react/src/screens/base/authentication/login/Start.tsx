import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthFormScreen, FormInput } from '../../../../components';
import useFlowHandler from '../../../../hooks/useFlowHandler';

export const Start = () => {
  const { emitEvent, currentUserState } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authentication.login.start` });
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);
  const emailRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    void emitEvent(FlowHandlerEvents.InitConditionalUI);
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [currentUserState]);

  const headerText = useMemo(() => t('header'), [t]);
  const subHeaderText = useMemo(() => t('subheader'), [t]);
  const flowChangeButtonText = useMemo(() => t('button_signup'), [t]);
  const emailFieldLabel = useMemo(() => t('textField_email'), [t]);
  const submitButtonText = useMemo(() => t('button_submit'), [t]);

  const handleSubmit = useCallback(() => {
    setLoading(true);
    void emitEvent(FlowHandlerEvents.PrimaryButton, { userStateUpdate: { email: emailRef.current?.value } });
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
          name='username'
          type='email'
          autoComplete='email webauthn'
          label={emailFieldLabel}
          ref={el => el && (emailRef.current = el)}
          error={currentUserState.emailError?.translatedMessage}
        />
      </AuthFormScreen>
    </>
  );
};
