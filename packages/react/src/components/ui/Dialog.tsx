import type { FC, ReactNode } from 'react';
import React from 'react';

import { PrimaryButton, SecondaryButton } from './buttons/Button';

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
          {header}
          <div
            className='cb-dialog-x-button'
            onClick={() => void closeAction()}
          >
            X
          </div>
        </div>
        {body ? <div className='cb-dialog-body'>{body}</div> : null}
        <div className='cb-dialog-footer'>
          <PrimaryButton
            isLoading={loadingConfirmAction}
            disabled={loadingCloseAction}
            onClick={() => void confirmAction()}
          >
            {confirmText}
          </PrimaryButton>
          {cancelText ? (
            <SecondaryButton
              isLoading={loadingCloseAction}
              disabled={loadingCloseAction}
              onClick={() => void closeAction()}
            >
              {cancelText}
            </SecondaryButton>
          ) : null}
        </div>
      </div>
    </div>
  );
};
