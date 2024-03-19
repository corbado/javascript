import { aaguidMappings, getParsedUA } from '@corbado/shared-ui';
import type { PassKeyItem } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Text } from '../ui2/typography/Text';

export interface PasskeyDetailsProps {
  passkey: PassKeyItem;
}

export const PasskeyDetails: FC<PasskeyDetailsProps> = ({ passkey }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'passkeysList' });
  const userAgent = getParsedUA(passkey.userAgent);
  const title = aaguidMappings[passkey.aaguid]?.name ?? 'Passkey';

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
            <Text
              level='3'
              fontFamilyVariant='secondary'
            >
              {t('badge_synced')}
            </Text>
          </div>
        ) : null}
      </div>
      <div>
        <Text
          level='3'
          fontFamilyVariant='secondary'
        >
          {t('field_credentialId')}
        </Text>
        {passkey.id}
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
              browser: userAgent.browser.name,
              os: userAgent.os.name,
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
