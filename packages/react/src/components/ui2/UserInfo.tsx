import type { FC, ReactNode } from 'react';
import React from 'react';

import { EditIcon } from './icons/EditIcon';
import { EmailIcon } from './icons/EmailIcon';
import { Text } from './typography/Text';

export interface UserInfoProps {
  userData: string;
  className?: string;
  leftIcon?: ReactNode;
  showLeftIcon?: boolean;
  onLeftIconClick?: () => void;
  rightIcon?: ReactNode;
  showRightIcon?: boolean;
  onRightIconClick?: () => void;
}

const defaultLeftIcon = <EmailIcon className='cb-user-info-section-left-icon-2' />;
const defaultRightIcon = <EditIcon className='cb-user-info-section-right-icon-2' />;

export const UserInfo: FC<UserInfoProps> = ({
  userData,
  className,
  leftIcon = defaultLeftIcon,
  showLeftIcon = true,
  rightIcon = defaultRightIcon,
  showRightIcon = true,
  onLeftIconClick,
  onRightIconClick,
}) => {
  return (
    <div className={`cb-user-info-section-2 ${className ? ` ${className}` : ''}`}>
      {showLeftIcon && (
        <div
          className='cb-user-info-section-left-2'
          onClick={onLeftIconClick}
        >
          {leftIcon}
        </div>
      )}
      <div className='cb-user-info-section-middle-2'>
        <Text
          level='2'
          fontWeight='normal'
          fontFamilyVariant='secondary'
          textColorVariant='secondary'
        >
          {userData}
        </Text>
      </div>
      {showRightIcon && (
        <div
          className='cb-user-info-section-right-2'
          onClick={onRightIconClick}
        >
          {rightIcon}
        </div>
      )}
    </div>
  );
};
