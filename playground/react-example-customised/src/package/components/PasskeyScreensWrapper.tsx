import { FC, ReactNode } from 'react';

import { Button } from './Button';
import { HorizontalRule } from './HorizontalRule';
import { Body, Header, SubHeader } from '.';

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
  loading?: boolean;
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
