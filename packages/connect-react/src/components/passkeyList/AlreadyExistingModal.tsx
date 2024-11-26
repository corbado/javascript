import React from 'react';

import { BaseModal } from '../shared/BaseModal';

type Props = {
  hide: () => void;
};

const AlreadyExistingModal = ({ hide }: Props) => (
  <BaseModal
    onPrimaryButton={() => hide()}
    onCloseButton={() => hide()}
    headerText='No passkey created'
    primaryButtonText='Okay'
    children={
      <>
        <p className='cb-p'>You already have a passkey that can be used on this device. </p>
        <p className='cb-p'>There is no need to create a new one.</p>
      </>
    }
  />
);

export default AlreadyExistingModal;
