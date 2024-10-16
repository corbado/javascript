import type { ContinueOnOtherEnvBlock, EmailVerifyBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Header, Text } from '../../../components/ui';
import { EmailLinkSuccessIcon } from '../../../components/ui/icons/EmailLinkSuccess';

export interface EmailLinkSuccessProps {
  block: EmailVerifyBlock | ContinueOnOtherEnvBlock;
  isOldTab?: boolean;
}

export const EmailLinkSuccess: FC<EmailLinkSuccessProps> = ({ block, isOldTab = false }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: `${block.authType}.email-verify.email-link-success`,
  });

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t(`subheader.${isOldTab ? 'isOldTab' : 'isNewTab'}`), [t]);
  const bodyText = useMemo(() => t('body'), [t]);

  return (
    <div className='cb-email-link-success-block'>
      <Header>{headerText}</Header>
      <Text
        level='2'
        className='cb-email-link-success-subheader'
      >
        {subheaderText}
      </Text>
      <div className='cb-email-link-success-icon-container'>
        <EmailLinkSuccessIcon className='cb-email-link-success-icon' />
      </div>
      <Text
        level='1'
        fontFamilyVariant='secondary'
      >
        {bodyText}
      </Text>
    </div>
  );
};
