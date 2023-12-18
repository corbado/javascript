import type { FC, ReactNode } from 'react';
import React from 'react';

import { Button } from './Button';

export interface DialogProps {
  isOpen: boolean;
  header: string;
  body: ReactNode;
  confirmText?: string;
  cancelText?: string;
  inverseButtonVariants?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const Dialog: FC<DialogProps> = ({
  isOpen,
  header,
  body,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  inverseButtonVariants = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className='dialog'
      onClick={onClose}
    >
      <div
        className='dialog-content'
        onClick={e => e.stopPropagation()}
      >
        <div className='dialog-header'>
          {header}
          <div
            className='dialog-x-button'
            onClick={onClose}
          >
            X
          </div>
        </div>
        <div className='dialog-body'>{body}</div>
        <div className='dialog-footer'>
          <Button
            variant={inverseButtonVariants ? 'close' : 'primary'}
            className='dialog-button'
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
          <Button
            variant={inverseButtonVariants ? 'primary' : 'close'}
            className='dialog-button'
            onClick={onClose}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};
