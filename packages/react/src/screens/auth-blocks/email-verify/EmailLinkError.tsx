import type { EmailVerifyBlock } from '@corbado/shared-ui';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { ExclamationIcon } from '../../../components/ui2/icons/ExclamationIcon';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';

export function EmailLinkError({ block }: { block: EmailVerifyBlock }) {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.email-verify.email-link-success`,
  });

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t('subheader'), [t]);
  const bodyText = useMemo(() => t('body'), [t]);

  return (
    <div className='cb-email-link-success-block-2'>
      <Header>{headerText}</Header>
      <Text level='2'>{subheaderText}</Text>
      <div>
        <ExclamationIcon />
      </div>
      <Text level='2'>{bodyText}</Text>
    </div>
  );
}
