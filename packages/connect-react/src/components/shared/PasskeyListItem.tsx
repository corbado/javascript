import { format } from 'date-fns';
import type { FC } from 'react';
import React from 'react';

import { CrossIcon } from './icons/CrossIcon';
import { EyeIcon } from './icons/EyeIcon';
import { PasskeyIcon } from './icons/PasskeyIcon';
import { ShieldTickIcon } from './icons/ShieldTickIcon';
import { SyncIcon } from './icons/SyncIcon';
import { LinkButton } from './LinkButton';
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
      <div className='cb-passkey-list-item-icon-container'>
        {icon ? (
          <img
            className='cb-passkey-list-item-icon'
            src={icon}
            alt={name}
          />
        ) : (
          <PasskeyIcon className='cb-passkey-list-item-icon' />
        )}
      </div>

      <div className='cb-passkey-list-item-content'>
        <div className='cb-passkey-list-item-header'>
          <div className='cb-passkey-list-item-title'>{name}</div>
          <div className='cb-passkey-list-item-tags'>
            {getTags().map(({ text, icon }) => (
              <Tag key={text}>
                {icon('cb-passkey-list-item-tag-icon')}
                <span>{text}</span>
              </Tag>
            ))}
          </div>
        </div>

        <div className='cb-passkey-list-item-details'>
          Created: {format(createdAt, 'dd-MM-yyyy HH:mm:ss')} with {browser} on {os}
        </div>

        <div className='cb-passkey-list-item-details'>Last used: {format(lastUsed, 'dd-MM-yyyy HH:mm:ss')}</div>
      </div>
      {onDeleteClick && (
        <div className='cb-passkey-list-item-delete-icon'>
          <LinkButton onClick={onDeleteClick}>
            <CrossIcon />
          </LinkButton>
        </div>
      )}
    </div>
  );
};
