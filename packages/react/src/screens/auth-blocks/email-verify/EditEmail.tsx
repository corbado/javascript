import type { EmailVerifyBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import InputField from '../../../components/ui2/input/InputField';
import { Header } from '../../../components/ui2/typography/Header';

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
  const primaryButtonText = useMemo(() => t('button_submit'), [t]);
  const secondaryButtonText = useMemo(() => t('button_cancel'), [t]);

  const handleConfirm = async () => {
    setLoading(true);

    const error = await block.updateEmail(email);

    if (error) {
      setErrorMessage(error);
      setLoading(false);
      return;
    }
  };

  return (
    <div className='cb-edit-data-section-2'>
      <Header
        size='md'
        className='cb-edit-data-section-header-2'
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
        isLoading={loading}
        disabled={email === block.data.email}
        onClick={() => void handleConfirm()}
      >
        {primaryButtonText}
      </PrimaryButton>
      <SecondaryButton
        className='cb-edit-data-section-back-button-2'
        onClick={() => block.showEmailVerificationScreen()}
      >
        {secondaryButtonText}
      </SecondaryButton>
    </div>
  );
};
