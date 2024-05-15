import type { PasskeyAppendAfterHybridBlock } from '@corbado/shared-ui/dist/flowHandler/blocks/PasskeyAppendAfterHybridBlock';
import React, { useCallback, useState } from 'react';

import { PrimaryButton, SecondaryButton, Text } from '../../../components';

export const PasskeyAppendAfterHybrid = ({ block }: { block: PasskeyAppendAfterHybridBlock }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const appendPasskey = useCallback(() => {
    setLoading(true);
    void block.passkeyAppend();
  }, [block]);

  return (
    <div className='cb-pk-append'>
      <Text>PasskeyAppendAfterHybrid</Text>
      <PrimaryButton
        isLoading={loading}
        onClick={appendPasskey}
      >
        Append
      </PrimaryButton>
      <div className='cb-pk-append-skip-button-section'>
        <SecondaryButton
          onClick={() => void block.skipPasskeyAppend()}
          disabled={loading}
        >
          Not now
        </SecondaryButton>
      </div>
    </div>
  );
};
