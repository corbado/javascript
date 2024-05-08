import { aaguidMappings } from '@corbado/shared-ui';
import type { PassKeyItem } from '@corbado/types';
import type { FC } from 'react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { ShieldIcon } from '../ui/icons/ShieldIcon';
import { SyncIcon } from '../ui/icons/SyncIcon';
// import { VisibilityIcon } from '../ui/icons/VisibilityIcon';
import { Text } from '../ui/typography/Text';

export interface PasskeyDetailsProps {
  passkey: PassKeyItem;
}

export const PasskeyDetails: FC<PasskeyDetailsProps> = ({ passkey }) => {
  const { t } = useTranslation('translation', { keyPrefix: 'passkey-list' });
  const passkeyBadges = [
    // {
    //   icon: <VisibilityIcon className='cb-passkey-list-header-badge-icon' />,
    //   text: t('badge.seen'),
    // },
  ];

  if (passkey.backupState) {
    passkeyBadges.push({
      icon: <SyncIcon className='cb-passkey-list-header-badge-icon' />,
      text: t('badge.synced'),
    });
  }

  if (passkey.transport.includes('hybrid')) {
    passkeyBadges.push({
      icon: <ShieldIcon className='cb-passkey-list-header-badge-icon' />,
      text: t('badge.hybrid'),
    });
  }

  const sourceBrowser = passkey.sourceBrowser;
  const sourceOS = passkey.sourceOS;
  const title = aaguidMappings[passkey.authenticatorAAGUID]?.name ?? 'Passkey';
  const hasMultipleBadgesClassName = passkeyBadges.length > 1 ? ' cb-has-multiple-badges' : '';

  return (
    <div className='cb-passkey-list-details'>
      <div className={`cb-passkey-list-header-badge-top-section${hasMultipleBadgesClassName}`}>
        {passkeyBadges.map((badge, index) => (
          <div
            key={index}
            className='cb-passkey-list-header-badge'
          >
            {badge.icon}
            <Text className='cb-passkey-list-header-badge-text'>{badge.text}</Text>
          </div>
        ))}
      </div>
      <div className='cb-passkey-list-header'>
        <div className='cb-passkey-list-header-title'>
          <Text className='cb-passkey-list-header-title'>{title}</Text>
        </div>
        <div className={`cb-passkey-list-header-badge-section${hasMultipleBadgesClassName}`}>
          {passkeyBadges.map((badge, index) => (
            <div
              key={index}
              className='cb-passkey-list-header-badge'
            >
              {badge.icon}
              <Text className='cb-passkey-list-header-badge-text'>{badge.text}</Text>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Text
          level='3'
          fontFamilyVariant='secondary'
          textColorVariant='secondary'
          className='cb-passkey-list-description-text'
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
          textColorVariant='secondary'
          className='cb-passkey-list-description-text'
        >
          {t('field_lastUsed')}
          {passkey.lastUsed}
        </Text>
      </div>
    </div>
  );
};
