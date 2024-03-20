import type { EmailVerifyBlock } from '@corbado/shared-ui';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ExclamationIcon } from '../../../components/ui2/icons/ExclamationIcon';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';

export function EmailLinkError({ block }: { block: EmailVerifyBlock }) {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.email-verify.email-link-error`,
  });

  const subheaderText = useMemo(() => t('subheader'), [t]);
  const bodyText = useMemo(() => t('body'), [t]);

  return (
    <div className='cb-email-link-error-block'>
      <Header>{block.data.translatedError}</Header>
      <Text
        level='2'
        className='cb-email-link-error-subheader'
      >
        {subheaderText}
      </Text>
      <div className='cb-email-link-error-icon-container'>
        <ExclamationIcon className='cb-email-link-error-icon' />
      </div>
      <Text level='2'>{bodyText}</Text>
    </div>
  );
}
