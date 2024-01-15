import type { FC, ReactNode } from 'react';
import React from 'react';

import type { ButtonVariants } from '../ui';
import { Body, Header, HorizontalRule, PrimaryButton, SecondaryButton, SubHeader, TertiaryButton } from '../ui';
import { FingerprintIcon } from '../ui/icons/Icons';

export interface PasskeyScreensWrapperProps {
  header: ReactNode;
  subHeader?: ReactNode;
  secondaryHeader?: ReactNode;
  body?: ReactNode;
  primaryButton: string;
  secondaryButton?: string;
  tertiaryButton?: string;
  showHorizontalRule?: boolean;
  onClick(btn: ButtonVariants): void;
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
        <PrimaryButton
          onClick={() => onClick('primary')}
          isLoading={primaryLoading}
          disabled={secondaryLoading}
        >
          {primaryButton}
        </PrimaryButton>
      )}

      {showHorizontalRule && <HorizontalRule>or</HorizontalRule>}

      {secondaryButton && (
        <SecondaryButton
          onClick={() => onClick('secondary')}
          isLoading={secondaryLoading}
          disabled={primaryLoading}
        >
          {secondaryButton}
        </SecondaryButton>
      )}
      {tertiaryButton && (
        <TertiaryButton
          onClick={() => onClick('tertiary')}
          disabled={primaryLoading || secondaryLoading}
        >
          {tertiaryButton}
        </TertiaryButton>
      )}
    </div>
  );
};
