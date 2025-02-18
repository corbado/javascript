import React from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import { PasskeySuccessIcon } from '../shared/icons/PasskeySuccessIcon';
import { PrimaryButton } from '../shared/PrimaryButton';

type Props = {
  aaguidName?: string;
  aaguidIcon?: string;
};

const AppendSuccessScreen = ({ aaguidName }: Props) => {
  const { config } = useAppendProcess();

  const [completing, setCompleting] = React.useState(false);

  let passkeyStoredTxt = <>Your passkey has been stored.</>;
  if (aaguidName) {
    passkeyStoredTxt = <>Your passkey is stored in {aaguidName}.</>;
  }

  return (
    <div className='cb-append-success-container cb-connect-append-border'>
      <div className='cb-append-success-header'>
        <div className='cb-h2 cb-bold'>Passkey Created Successfully</div>
      </div>
      <div className='cb-append-success-icons'>
        <PasskeySuccessIcon />
      </div>
      <div className='cb-h3 cb-append-success-message'>{passkeyStoredTxt}</div>
      <div className='cb-divider'></div>
      <div className='cb-p'>You can now use your fingerprint, face or PIN to log in.</div>
      <div className='cb-append-success-cta'>
        <PrimaryButton
          className='cb-append-success-cta-continue'
          isLoading={completing}
          onClick={() => {
            if (completing) {
              return;
            }

            setCompleting(true);
            void config.onComplete('complete');
          }}
        >
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
};

export default AppendSuccessScreen;
