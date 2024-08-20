import { format } from 'date-fns';
import type { FC } from 'react';
import React from 'react';

import { CrossIcon } from './icons/CrossIcon';
import { EyeIcon } from './icons/EyeIcon';
import { PasskeyIcon } from './icons/PasskeyIcon';
import { ShieldTickIcon } from './icons/ShieldTickIcon';
import { SyncIcon } from './icons/SyncIcon';
import { LinkButton } from './LinkButton';
import { LoadingSpinner } from './LoadingSpinner';
import { Tag } from './Tag';

export type Props = {
  name: string;
  icon?: string;
  createdAt: string | Date;
  lastUsed: string | Date;
  browser: string;
  os: 'Windows' | 'macOS' | 'Android' | 'iOS' | string;
  isThisDevice?: boolean;
  isSynced?: boolean;
  isHybrid?: boolean;
  onDeleteClick?: () => void;
  isDeleteLoading?: boolean;
};

export const PasskeyListItem: FC<Props> = ({
  name,
  icon,
  os,
  createdAt,
  browser,
  lastUsed,
  onDeleteClick,
  isSynced,
  isHybrid,
  isThisDevice,
  isDeleteLoading,
}) => {
  const getTags = () => {
    const tags = [];

    if (isSynced) {
      tags.push({ text: 'Synced', icon: (className: string) => SyncIcon({ className }) });
    }

    if (isHybrid) {
      tags.push({ text: 'Hybrid', icon: (className: string) => ShieldTickIcon({ className }) });
    }

    if (isThisDevice) {
      tags.push({ text: 'Seen on this device', icon: (className: string) => EyeIcon({ className }) });
    }

    return tags;
  };

  return (
    <div className='cb-passkey-list-item'>
      {icon ? (
        <div className='cb-passkey-list-item-icon-container'>
          <img
            className='cb-passkey-list-item-icon'
            src={icon}
            alt={name}
          />
        </div>
      ) : (
        <PasskeyIcon className='cb-passkey-list-item-icon' />
      )}

      <div className='cb-passkey-list-item-content'>
        <div className='cb-passkey-list-item-header'>
          <div className='cb-passkey-list-item-tags'>
            {getTags().map(({ text, icon }) => (
              <Tag key={text}>
                {icon('cb-passkey-list-item-tag-icon')}
                <p>{text}</p>
              </Tag>
            ))}
          </div>
          <h2 className='cb-passkey-list-item-title cb-bold'>{name}</h2>
        </div>

        <p className='cb-passkey-list-item-details'>
          Created: {format(createdAt, 'dd-MM-yyyy HH:mm:ss')} with {browser} on {os}
        </p>

        <p className='cb-passkey-list-item-details'>Last used: {format(lastUsed, 'dd-MM-yyyy HH:mm:ss')}</p>
      </div>
      {onDeleteClick && (
        <div className='cb-passkey-list-item-delete-icon'>
          {isDeleteLoading ? (
            <LoadingSpinner variant='primary'></LoadingSpinner>
          ) : (
            <LinkButton onClick={onDeleteClick}>
              <CrossIcon />
            </LinkButton>
          )}
        </div>
      )}
    </div>
  );
};
