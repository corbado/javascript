import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import type { ConnectService } from '@corbado/web-core/dist/services/ConnectService';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { PrimaryButton } from '../../components';
import InputField from '../../components/ui/input/InputField';

type Props = {
  connectService: ConnectService;
  conditionalUIChallenge: string | null;
  onComplete: (method: string) => void;
  onFallback: (identifier: string) => void;
};

const LoginAllowedScreen = ({ connectService, onComplete, onFallback, conditionalUIChallenge }: Props) => {
  const [loading, setLoading] = useState(false);
  const emailFieldRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const init = async () => {
      if (conditionalUIChallenge) {
        const res = await connectService.conditionalUILogin();
        if (res.err && (res.val instanceof PasskeyChallengeCancelledError || res.val.ignore)) {
          return;
        }

        if (res.err) {
          onFallback('');
        }

        onComplete('');
      }
    };

    void init();
  }, [conditionalUIChallenge]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const identifier = emailFieldRef.current?.value ?? '';

    const res = await connectService.login(identifier);
    if (res.err) {
      setLoading(false);
      onFallback(identifier);
      return;
    }

    setLoading(false);
    onComplete('');
  }, []);

  return (
    <div className='cb-connect-container'>
      <InputField
        label='Email address'
        id='email'
        name='email'
        type='email'
        autoComplete='username webauthn'
        autoFocus={true}
        ref={(el: HTMLInputElement | null) => el && (emailFieldRef.current = el)}
      />
      <PrimaryButton
        type='submit'
        className='cb-signup-form-submit-button'
        isLoading={loading}
        onClick={() => void handleSubmit()}
      >
        Login
      </PrimaryButton>
    </div>
  );
};

export default LoginAllowedScreen;
