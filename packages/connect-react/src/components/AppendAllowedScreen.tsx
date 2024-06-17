import type { ConnectService } from '@corbado/web-core/dist/services/ConnectService';
import React, { useCallback, useState } from 'react';

import { PrimaryButton } from './shared/PrimaryButton';

type Props = {
  connectService: ConnectService;
  appendToken: string;
  onComplete: (method: string) => void;
  onSkip: () => void;
};

const AppendAllowedScreen = ({ connectService, onComplete, onSkip, appendToken }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const res = await connectService.append(appendToken);
    if (res.err) {
      setLoading(false);
      onSkip();
      return;
    }

    setLoading(false);
    onComplete('');
  }, []);

  return (
    <div className='cb-connect-container'>
      Do you want to append a passkey?
      <PrimaryButton
        type='submit'
        isLoading={loading}
        onClick={() => void handleSubmit()}
      >
        Yes
      </PrimaryButton>
      <PrimaryButton
        type='submit'
        isLoading={loading}
        onClick={() => void onSkip()}
      >
        No
      </PrimaryButton>
    </div>
  );
};

export default AppendAllowedScreen;
