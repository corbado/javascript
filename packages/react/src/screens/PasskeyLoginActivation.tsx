import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import type { ButtonType } from '../components/PasscodeScreensWrapper';
import { PasscodeScreensWrapper } from '../components/PasscodeScreensWrapper';

export const PasskeyLoginActivation = () => {
  const { t } = useTranslation();

  const header = (
    <Trans i18nKey='activate_passkey.header'>
      text <span className='text-primary-color underline'>x</span>
    </Trans>
  );

  const primaryButton = t('activate_passkey.primary_btn');
  const secondaryButton = t('activate_passkey.secondary_btn');

  const handlePasskeyActivation = () => console.log('Activate passkey login');
  const handleLater = () => console.log('Maybe later');

  const handleClick = (btn: ButtonType) => {
    if (btn === 'primary') {
      return handlePasskeyActivation();
    }
    handleLater();
  };

  const props = {
    header,
    primaryButton,
    secondaryButton,
    onClick: handleClick,
  };

  return (
    <>
      <PasscodeScreensWrapper {...props} />
    </>
  );
};
