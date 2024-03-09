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

  if (block.data.translatedError) {
    return <div>Error: {block.data.translatedError}</div>;
  }

  return <div>Verification in progress</div>;
};
