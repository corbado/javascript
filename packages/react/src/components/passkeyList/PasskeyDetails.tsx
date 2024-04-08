import { aaguidMappings } from '@corbado/shared-ui';
import type { PassKeyItem } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Text } from '../ui/typography/Text';

export interface PasskeyDetailsProps {
  passkey: PassKeyItem;
}

export const PasskeyDetails: FC<PasskeyDetailsProps> = ({ passkey }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'passkey-list' });
  const sourceBrowser = passkey.sourceBrowser;
  const sourceOS = passkey.sourceOS;
  const title = aaguidMappings[passkey.authenticatorAAGUID]?.name ?? 'Passkey';

  return (
    <div className='cb-passkey-list-details'>
      <div className='cb-passkey-list-header'>
        <div className='cb-passkey-list-header-title'>
          <Text
            level='4'
            fontWeight='bold'
            fontFamilyVariant='secondary'
          >
            {title}
          </Text>
        </div>
        {passkey.backupState ? (
          <div className='cb-passkey-list-header-badge'>
            <Text fontFamilyVariant='secondary'>{t('badge_synced')}</Text>
          </div>
        ) : null}
      </div>
      <div>
        <Text
          level='3'
          fontFamilyVariant='secondary'
        >
          {t('field_credentialId')}
          {passkey.id}
        </Text>
      </div>
      <div>
        <Text
          level='3'
          fontFamilyVariant='secondary'
        >
          <Trans
            i18nKey='field_created'
            t={t}
            values={{
              date: passkey.created,
              browser: sourceBrowser,
              os: sourceOS,
            }}
          />
        </Text>
      </div>
      <div>
        <Text
          level='3'
          fontFamilyVariant='secondary'
        >
          {t('field_lastUsed')}
          {passkey.lastUsed}
        </Text>
      </div>
      <div>
        <Text
          level='3'
          fontFamilyVariant='secondary'
        >
          {t('field_status')}
          {passkey.status}
        </Text>
      </div>
    </div>
  );
};
