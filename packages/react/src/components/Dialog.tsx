import type { FC, ReactNode } from 'react';
import React from 'react';

export interface DialogProps {
  isOpen: boolean;
  header: string;
  body: ReactNode;
  confirmText: string;
  cancelText: string;
  onClose: () => void;
  onConfirm: () => void;
}

const Dialog: FC<DialogProps> = ({ isOpen, onClose, onConfirm, header, confirmText, cancelText, body }) => {
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
          <button
            onClick={onClose}
            style={{ float: 'right', cursor: 'pointer' }}
          >
            X
          </button>
        </div>
        <div className='dialog-body'>{body}</div>
        <div className='dialog-footer'>
          <button
            className='btn-danger'
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            className='btn-outline'
            onClick={onClose}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
