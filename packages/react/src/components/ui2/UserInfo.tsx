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

const defaultLeftIcon = <EmailIcon className='cb-user-info-section-left-icon' />;
const defaultRightIcon = <EditIcon className='cb-user-info-section-right-icon' />;

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
    <div className={`cb-user-info-section ${className ? ` ${className}` : ''}`}>
      {showLeftIcon && (
        <div
          className='cb-user-info-section-left'
          onClick={onLeftIconClick}
        >
          {leftIcon}
        </div>
      )}
      <div className='cb-user-info-section-middle'>
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
          className='cb-user-info-section-right'
          onClick={onRightIconClick}
        >
          {rightIcon}
        </div>
      )}
    </div>
  );
};
