import type { ContinueOnOtherEnvBlock } from '@corbado/shared-ui';
import { ContinueOnOtherEnvReasons } from '@corbado/shared-ui';
import React from 'react';

export const ContinueOnOtherEnv = ({ block }: { block: ContinueOnOtherEnvBlock }) => {
  if (block.data.reason === ContinueOnOtherEnvReasons.EmailLinkVerified) {
    return <div>Email has been verified. Continue on other tab</div>;
  }

  return <div>Authentication process has been completed. Continue on other tab.</div>;
};
