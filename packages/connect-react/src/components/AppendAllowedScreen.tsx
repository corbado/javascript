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
      console.log('error:', res.val);
      setLoading(false);
      onSkip();
      return;
    }

    setLoading(false);
    onComplete('');
  }, []);

  return (
    <div className='cb-connect-container'>
      <p>Do you want to append a passkey?</p>
      <p>
        <PrimaryButton
          type='submit'
          isLoading={loading}
          onClick={() => void handleSubmit()}
        >
          Activate your passkey
        </PrimaryButton>
      </p>
      <p>
        <PrimaryButton
          type='submit'
          isLoading={loading}
          onClick={() => void onSkip()}
        >
          Skip for now
        </PrimaryButton>
      </p>
    </div>
  );
};

export default AppendAllowedScreen;
