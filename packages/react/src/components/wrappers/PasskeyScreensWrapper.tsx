import type { FC, ReactNode } from 'react';
import React from 'react';

import { Body, Button, Header, HorizontalRule, SubHeader } from '../ui';
import { FingerprintIcon } from '../ui/icons/Icons';

export type ButtonType = 'primary' | 'secondary' | 'tertiary';

export interface PasskeyScreensWrapperProps {
  header: ReactNode;
  subHeader?: ReactNode;
  secondaryHeader?: ReactNode;
  body?: ReactNode;
  primaryButton: string;
  secondaryButton?: string;
  tertiaryButton?: string;
  showHorizontalRule?: boolean;

  onClick(btn: ButtonType): void;

  primaryLoading?: boolean;
  secondaryLoading?: boolean;
  hideFingerPrintIcon?: boolean;
}

export const PasskeyScreensWrapper: FC<PasskeyScreensWrapperProps> = ({
  header,
  subHeader,
  secondaryHeader,
  body,
  primaryButton,
  secondaryButton,
  tertiaryButton,
  showHorizontalRule = false,
  onClick,
  primaryLoading = false,
  secondaryLoading = false,
  hideFingerPrintIcon = false,
}) => {
  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>

      {subHeader && <SubHeader className='cb-subheader-spacing'>{subHeader}</SubHeader>}

      {!hideFingerPrintIcon && <FingerprintIcon className={'cb-finger-print-icon'} />}

      {secondaryHeader && <Header className='cb-secondary-header-spacing'>{secondaryHeader}</Header>}

      {body && <Body className='cb-body-spacing'>{body}</Body>}

      {primaryButton && (
        <Button
          variant='primary'
          onClick={() => onClick('primary')}
          isLoading={primaryLoading}
          disabled={primaryLoading || secondaryLoading}
        >
          {primaryButton}
        </Button>
      )}

      {showHorizontalRule && <HorizontalRule>or</HorizontalRule>}

      {secondaryButton && (
        <Button
          variant='secondary'
          onClick={() => onClick('secondary')}
          isLoading={secondaryLoading}
          disabled={primaryLoading || secondaryLoading}
        >
          {secondaryButton}
        </Button>
      )}

      {tertiaryButton && (
        <Button
          variant='tertiary'
          onClick={() => onClick('tertiary')}
          disabled={primaryLoading || secondaryLoading}
        >
          {tertiaryButton}
        </Button>
      )}
    </div>
  );
};
