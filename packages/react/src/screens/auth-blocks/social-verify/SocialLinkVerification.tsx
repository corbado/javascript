import type { SocialVerifyBlock } from '@corbado/shared-ui';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingSpinner } from '../../../components/ui2/LoadingSpinner';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';

export const SocialLinkVerification = ({ block }: { block: SocialVerifyBlock }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.email-verify.email-link-verification`,
  });

  useEffect(() => {
    const abortController = new AbortController();
    void block.startSocialVerification(abortController);

    return () => {
      abortController.abort();
    };
  }, []);

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t('subheader'), [t]);

  return (
    <div className='cb-email-link-verification-block'>
      <Header>{headerText}</Header>
      <Text level='2'>{subheaderText}</Text>
      <LoadingSpinner className='cb-email-link-verification-spinner' />
    </div>
  );
};
