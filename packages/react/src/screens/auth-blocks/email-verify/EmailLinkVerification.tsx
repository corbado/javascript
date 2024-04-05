import type { EmailVerifyBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Header, LoadingSpinner, Text } from '../../../components';
import { EmailLinkError } from './EmailLinkError';

export const EmailLinkVerification = ({ block }: { block: EmailVerifyBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.email-verify.email-link-verification`,
  });

  useEffect(() => {
    const abortController = new AbortController();
    void block.validateEmailLink(abortController);

    return () => {
      abortController.abort();
    };
  }, []);

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t('subheader'), [t]);

  if (block.data.translatedError) {
    return <EmailLinkError block={block} />;
  }

  return (
    <div className='cb-email-link-verification-block'>
      <Header>{headerText}</Header>
      <Text level='2'>{subheaderText}</Text>
      <LoadingSpinner className='cb-email-link-verification-spinner' />
    </div>
  );
};
