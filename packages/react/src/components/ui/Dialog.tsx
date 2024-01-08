import type { FC, ReactNode } from 'react';
import React from 'react';

import { Button } from './Button';

export interface DialogProps {
  isOpen: boolean;
  header: string;
  body?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  inverseButtonVariants?: boolean;
  onClose: () => Promise<void> | void;
  onConfirm: () => Promise<void> | void;
}

export const Dialog: FC<DialogProps> = ({
  isOpen,
  header,
  body,
  confirmText = 'Yes',
  cancelText,
  inverseButtonVariants = false,
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
          <Button
            variant={inverseButtonVariants ? 'close' : 'primary'}
            className='cb-dialog-button'
            isLoading={loadingConfirmAction}
            disabled={loadingConfirmAction || loadingCloseAction}
            onClick={() => void confirmAction()}
          >
            {confirmText}
          </Button>
          {cancelText ? (
            <Button
              variant={inverseButtonVariants ? 'primary' : 'close'}
              className='cb-dialog-button'
              isLoading={loadingCloseAction}
              disabled={loadingConfirmAction || loadingCloseAction}
              onClick={() => void closeAction()}
            >
              {cancelText}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
