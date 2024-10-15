import React, { useState } from 'react';

import { CrossIcon } from './icons/CrossIcon';
import { PrimaryButton } from './PrimaryButton';
import { OutlineButton } from './OutlineButton';

type Props = {
  onCloseButton?: () => void;
  onPrimaryButton: () => Promise<void> | void;
  onSecondaryButton?: () => Promise<void> | void;
  headerText: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
  children: React.ReactNode;
};

export const BaseModal = ({
  onCloseButton,
  onPrimaryButton,
  onSecondaryButton,
  headerText,
  primaryButtonText,
  secondaryButtonText,
  children,
}: Props) => {
  const [primaryButtonLoading, setPrimaryButtonLoading] = useState(false);
  const [secondaryButtonLoading, setSecondaryButtonLoading] = useState(false);

  const onPrimary = async () => {
    setPrimaryButtonLoading(true);
    await onPrimaryButton();
    setPrimaryButtonLoading(false);
  };

  const onSecondary = async () => {
    if (!onSecondaryButton) {
      return;
    }

    setSecondaryButtonLoading(true);
    await onSecondaryButton();
    setSecondaryButtonLoading(false);
  };

  return (
    <div className='cb-modal'>
      <div className='cb-modal-header'>
        <h2 className='cb-h2'>{headerText}</h2>
        {onCloseButton && (
          <CrossIcon
            className='cb-modal-exit-icon'
            onClick={onCloseButton}
          />
        )}
      </div>

      <div className='cb-modal-content'>{children}</div>

      <div className='cb-modal-cta'>
        <PrimaryButton
          onClick={() => void onPrimary()}
          className='cb-modal-button-primary'
          isLoading={primaryButtonLoading}
        >
          {primaryButtonText}
        </PrimaryButton>
        {onSecondaryButton && (
          <OutlineButton
            onClick={() => void onSecondary()}
            className='cb-modal-button-secondary'
            isLoading={secondaryButtonLoading}
          >
            {secondaryButtonText}
          </OutlineButton>
        )}
      </div>
    </div>
  );
};
