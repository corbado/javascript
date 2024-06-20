import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import type { ConnectService } from '@corbado/web-core/dist/services/ConnectService';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import InputField from './shared/InputField';
import { PrimaryButton } from './shared/PrimaryButton';

type Props = {
  connectService: ConnectService;
  conditionalUIChallenge: string | null;
  onComplete: (session: string) => void;
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
          return;
        }

        onComplete(res.val.session);
      }
    };

    void init();

    return () => {
      connectService.dispose();
    };
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
    console.log('on complete', res.val.session);
    onComplete(res.val.session);
  }, []);

  return (
    <div className='cb-connect-container'>
      <InputField
        id='email'
        name='email'
        type='email'
        autoComplete='username webauthn'
        autoFocus={true}
        placeholder='Email address'
        ref={(el: HTMLInputElement | null) => el && (emailFieldRef.current = el)}
      />
      <PrimaryButton
        type='submit'
        isLoading={loading}
        onClick={() => void handleSubmit()}
      >
        Login
      </PrimaryButton>
    </div>
  );
};

export default LoginAllowedScreen;
