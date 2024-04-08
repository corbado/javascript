import type { EmailVerifyBlock } from '@corbado/shared-ui';
import type { FC, FormEvent } from 'react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Header, InputField, PrimaryButton, SecondaryButton } from '../../../components';

export interface EditEmailProps {
  block: EmailVerifyBlock;
}

export const EditEmail: FC<EditEmailProps> = ({ block }) => {
  const { t } = useTranslation('translation', { keyPrefix: `${block.authType}.email-verify.edit-email` });
  const [email, setEmail] = useState<string>(block.data.email);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const headerText = useMemo(() => t('header'), [t]);
  const primaryButtonText = useMemo(
    () => t(`button_submit.${block.data.verificationMethod === 'email-otp' ? 'emailOtp' : 'emailLink'}`),
    [t],
  );
  const secondaryButtonText = useMemo(() => t('button_cancel'), [t]);

  const handleConfirm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      const error = await block.updateEmail(email);

      if (error) {
        setErrorMessage(error);
        setLoading(false);
        return;
      }
    },
    [block, email],
  );

  return (
    <form
      className='cb-edit-data-section'
      onSubmit={e => void handleConfirm(e)}
    >
      <Header
        size='md'
        className='cb-edit-data-section-header'
      >
        {headerText}
      </Header>
      <InputField
        value={email}
        errorMessage={errorMessage}
        ref={emailInputRef}
        onChange={e => setEmail(e.target.value)}
      />
      <PrimaryButton
        type='submit'
        isLoading={loading}
        onClick={e => {
          const noChange = email === block.data.email;
          if (noChange) {
            block.showEmailVerificationScreen();
            return;
          }

          void handleConfirm(e);
        }}
      >
        {primaryButtonText}
      </PrimaryButton>
      <SecondaryButton
        className='cb-edit-data-section-back-button'
        onClick={() => block.showEmailVerificationScreen()}
      >
        {secondaryButtonText}
      </SecondaryButton>
    </form>
  );
};
