import React from 'react';

import { BaseModal } from '../shared/BaseModal';

type Props = {
  hide: () => void;
};

const PasskeyAppendNotSupportedModal = ({ hide }: Props) => (
  <BaseModal
    onPrimaryButton={() => hide()}
    onCloseButton={() => hide()}
    headerText='No passkey created'
    primaryButtonText='Okay'
    children={
      <>
        <p className='cb-p'>Your current device does not support passkeys.</p>
      </>
    }
  />
);

export default PasskeyAppendNotSupportedModal;
