import type { EmailVerifyBlock } from '@corbado/shared-ui';
import React, { useEffect } from 'react';

export const EmailLinkVerification = ({ block }: { block: EmailVerifyBlock }) => {
  useEffect(() => {
    const abortController = new AbortController();
    void block.validateEmailLink(abortController);

    return () => {
      abortController.abort();
    };
  }, []);

  if (block.continueOnOtherDevice) {
    return <div className='cb-email-link-verification'>Email has been verified. Continue on other tab</div>;
  }

  return <div className='cb-pk-appended-bloc-2'>Verification in progress</div>;
};
