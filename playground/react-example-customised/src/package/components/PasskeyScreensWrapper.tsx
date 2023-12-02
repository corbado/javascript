import React from 'react';

import { Button } from './Button';
import { HorizontalRule } from './HorizontalRule';
import { Body, Header, SubHeader } from '.';

export type ButtonType = 'primary' | 'secondary' | 'tertiary';

export interface PassketScreensWrapperProps {
  header: React.ReactNode;
  subHeader?: React.ReactNode;
  secondaryHeader?: React.ReactNode;
  body?: React.ReactNode;
  primaryButton: string;
  secondaryButton?: string;
  tertiaryButton?: string;
  showHorizontalRule?: boolean;
  onClick(btn: ButtonType): void;
  loading?: boolean;
  hideFingerPrintIcon?: boolean;
}

export const PasskeyScreensWrapper: React.FC<PassketScreensWrapperProps> = ({
  header,
  subHeader,
  secondaryHeader,
  body,
  primaryButton,
  secondaryButton,
  tertiaryButton,
  showHorizontalRule = false,
  onClick,
  loading = false,
  hideFingerPrintIcon = false,
}) => {
  return (
    <div className='cb-layout-passkey'>
      <Header>{header}</Header>
      {subHeader && <SubHeader className='cb-subheader-spacing'>{subHeader}</SubHeader>}
      {!hideFingerPrintIcon && <div className='cb-finger-print-icon'></div>}
      {secondaryHeader && <Header className='cb-secondary-header-spacing'>{secondaryHeader}</Header>}
      {body && <Body className='cb-body-spacing'>{body}</Body>}
      {primaryButton && (
        <Button
          variant='primary'
          onClick={() => onClick('primary')}
          isLoading={loading}
          disabled={loading}
        >
          {primaryButton}
        </Button>
      )}
      {showHorizontalRule && <HorizontalRule />}
      {secondaryButton && (
        <Button
          variant='secondary'
          onClick={() => onClick('secondary')}
          isLoading={loading}
          disabled={loading}
        >
          {secondaryButton}
        </Button>
      )}
      {tertiaryButton && (
        <Button
          className='my-0 !py-0'
          variant='tertiary'
          onClick={() => onClick('tertiary')}
          isLoading={loading}
          disabled={loading}
        >
          {tertiaryButton}
        </Button>
      )}
    </div>
  );
};
