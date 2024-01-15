import { FlowHandlerEvents } from '@corbado/shared-ui';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AuthFormScreenWrapper, FormInput, Header, SubHeader } from '../../../components';
import useFlowHandler from '../../../hooks/useFlowHandler';

export const Start = () => {
  const { emitEvent, currentUserState, currentFlow } = useFlowHandler();
  const { t } = useTranslation('translation', { keyPrefix: `authentication.${currentFlow}.start` });
  const [formEmail, setFormEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const initialized = useRef(false);

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

  const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setFormEmail(event.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    setLoading(true);
    void emitEvent(FlowHandlerEvents.PrimaryButton, { userStateUpdate: { email: formEmail } });
  }, [formEmail, emitEvent]);

  return (
    <>
      <Header>{t('header')}</Header>
      <SubHeader>
        {t('subheader')}
        <span
          className='cb-link-secondary'
          onClick={() => void emitEvent(FlowHandlerEvents.ChangeFlow)}
        >
          {t('button_signup')}
        </span>
      </SubHeader>
      <AuthFormScreenWrapper
        onSubmit={handleSubmit}
        submitButtonText={t('button_submit')}
        loading={loading}
      >
        <FormInput
          name='username'
          type='email'
          autoComplete='email webauthn'
          label={t('textField_email')}
          onChange={onChange}
          value={formEmail}
          error={currentUserState.emailError?.translatedMessage}
        />
      </AuthFormScreenWrapper>
    </>
  );
};
