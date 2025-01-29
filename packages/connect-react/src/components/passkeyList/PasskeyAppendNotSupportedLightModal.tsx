import React from 'react';

import { BaseModal } from '../shared/BaseModal';

type Props = {
  hide: () => void;
};

const PasskeyAppendNotSupportedLightModal = ({ hide }: Props) => (
  <BaseModal
    onPrimaryButton={() => hide()}
    onCloseButton={() => hide()}
    headerText='No passkey created'
    primaryButtonText='Okay'
    children={
      <>
        <p className='cb-p'>This in-app view doesn't support passkeys. Use your standard browser.</p>
      </>
    }
  />
);

export default PasskeyAppendNotSupportedLightModal;
