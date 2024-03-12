import type { EmailVerifyBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { EmailLinkSuccessIcon } from '../../../components/ui2/icons/EmailLinkSuccess';
import { Header } from '../../../components/ui2/typography/Header';
import { Text } from '../../../components/ui2/typography/Text';

export interface EmailLinkSuccessProps {
  block: EmailVerifyBlock;
  isOldTab: boolean;
}

export const EmailLinkSuccess: FC<EmailLinkSuccessProps> = ({ block, isOldTab }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.email-verify.email-link-success`,
  });

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t(`subheader. ${isOldTab ? 'isOldTab' : 'isNewTab'}`), [t]);
  const bodyText = useMemo(() => t('body'), [t]);

  return (
    <div className='cb-email-link-success-block-2'>
      <Header>{headerText}</Header>
      <Text level='2'>{subheaderText}</Text>
      <div className='cb-email-link-success-icon-container-2'>
        <EmailLinkSuccessIcon className='cb-email-link-success-icon-2' />
      </div>
      <Text level='2'>{bodyText}</Text>
    </div>
  );
};
