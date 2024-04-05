import type { FC, ReactNode } from 'react';
import React from 'react';

import { PrimaryButton } from './buttons/PrimaryButton';
import { SecondaryButton } from './buttons/SecondaryButton';
import { CancelIcon } from './icons/CancelIcon';
import { Header } from './typography/Header';
import { Text } from './typography/Text';

export interface DialogProps {
  isOpen: boolean;
  header: string;
  body?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  onClose: () => Promise<void> | void;
  onConfirm: () => Promise<void> | void;
}

export const Dialog: FC<DialogProps> = ({
  isOpen,
  header,
  body,
  confirmText = 'Yes',
  cancelText,
  onClose,
  onConfirm,
}) => {
  const [loadingCloseAction, setLoadingCloseAction] = React.useState(false);
  const [loadingConfirmAction, setLoadingConfirmAction] = React.useState(false);

  if (!isOpen) {
    return null;
  }

  const closeAction = async () => {
    if (onClose) {
      setLoadingCloseAction(true);
      await onClose();
      setLoadingCloseAction(false);
    }
  };

  const confirmAction = async () => {
    if (onConfirm) {
      setLoadingConfirmAction(true);
      await onConfirm();
      setLoadingConfirmAction(false);
    }
  };

  return (
    <div
      className='cb-dialog'
      onClick={() => void closeAction()}
    >
      <div
        className='cb-dialog-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='cb-dialog-header'>
          <Header className='cb-dialog-header-text'>{header}</Header>
          <CancelIcon
            className='cb-dialog-x-button'
            onClick={() => void closeAction()}
          />
        </div>
        {body ? (
          <div className='cb-dialog-body'>
            <Text
              level='3'
              fontFamilyVariant='secondary'
            >
              {body}
            </Text>
          </div>
        ) : null}
        <div className='cb-dialog-footer'>
          <PrimaryButton
            className='cb-dialog-button'
            colorVariant='error'
            isLoading={loadingConfirmAction}
            disabled={loadingCloseAction}
            onClick={() => void confirmAction()}
          >
            {confirmText}
          </PrimaryButton>
          {cancelText ? (
            <span className='cb-dialog-button'>
              <SecondaryButton
                disabled={loadingCloseAction}
                onClick={() => void closeAction()}
              >
                {cancelText}
              </SecondaryButton>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
