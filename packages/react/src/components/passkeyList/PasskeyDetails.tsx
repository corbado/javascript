import { aaguidMappings, getParsedUA } from '@corbado/shared-ui';
import type { PassKeyItem } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export interface PasskeyDetailsProps {
  passkey: PassKeyItem;
}

const PasskeyDetails: FC<PasskeyDetailsProps> = ({ passkey }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'passkeysList' });
  const userAgent = getParsedUA(passkey.userAgent);
  const title = aaguidMappings[passkey.aaguid]?.name ?? 'Passkey';

  return (
    <div className='cb-passkey-list-details'>
      <div className='cb-passkey-list-header'>
        <div className='cb-passkey-list-header-title'>{title}</div>
        {passkey.backupState ? <div className='cb-passkey-list-header-badge'>{t('badge_synced')}</div> : null}
      </div>
      <div>
        {t('field_credentialId')}
        {passkey.id}
      </div>
      <div>
        {t('field_created_text1')}
        {passkey.created}
        {t('field_created_text2')}
        {userAgent?.browser.name}
        {t('field_created_text3')}
        {userAgent?.os.name}
      </div>
      <div>
        {t('field_lastUsed')}
        {passkey.lastUsed}
      </div>
      <div>
        {t('field_status')}
        {passkey.status}
      </div>
    </div>
  );
};

export default PasskeyDetails;
