import type { EmailVerifyBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingSpinner } from '../../../components/ui2/LoadingSpinner';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';
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
    <div className='cb-email-link-verification-block-2'>
      <Header>{headerText}</Header>
      <Text level='2'>{subheaderText}</Text>
      <LoadingSpinner className='cb-email-link-verification-spinner-2' />
    </div>
  );
};
