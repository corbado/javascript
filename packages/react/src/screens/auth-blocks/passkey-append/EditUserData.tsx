import type { PasskeyAppendBlock } from '@corbado/shared-ui';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { PrimaryButton } from '../../../components/ui2/buttons/PrimaryButton';
import { SecondaryButton } from '../../../components/ui2/buttons/SecondaryButton';
import InputField from '../../../components/ui2/InputField';
import { Header } from '../../../components/ui2/typography/Header';

export interface EditUserDataProps {
  block: PasskeyAppendBlock;
  back: () => void;
}

export const EditUserData: FC<EditUserDataProps> = ({ block, back }) => {
  const [passkeyUserHandle, setPasskeyUserHandle] = useState<string>(block.data.userHandle);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [emailUpdated, setEmailUpdated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (emailUpdated) {
      setLoading(false);

      if (block.data.translatedError) {
        setErrorMessage(block.data.translatedError);
      } else {
        back();
      }
    }
  }, [block]);

  const handleConfirm = async () => {
    setLoading(true);

    if (block.data.userHandle === passkeyUserHandle) {
      back();
      return;
    }

    await block.updateEmail(passkeyUserHandle);
    setEmailUpdated(true);
  };

  return (
    <div className='new-ui-component'>
      <div className='cb-container-2'>
        <div className='cb-pk-edit-email-section-2'>
          <Header
            size='md'
            className='cb-pk-edit-email-section-header-2'
          >
            Type new email address
          </Header>
          <InputField
            value={passkeyUserHandle}
            errorMessage={errorMessage}
            onChange={e => setPasskeyUserHandle(e.target.value)}
          />
          <PrimaryButton
            isLoading={loading}
            onClick={() => void handleConfirm()}
          >
            Confirm
          </PrimaryButton>
          <SecondaryButton
            className='cb-pk-edit-email-section-back-button-2'
            onClick={back}
          >
            Back
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
