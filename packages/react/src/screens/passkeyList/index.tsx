import { useCorbado } from '@corbado/react-sdk';
import { makeApiCallWithErrorHandler } from '@corbado/shared-ui';
import type { PassKeyList } from '@corbado/types';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { Button, Spinner } from '../../components';
import PasskeyAgentIcon from './PasskeyAgentIcon';
import PasskeyDelete from './PasskeyDelete';
import PasskeyDetails from './PasskeyDetails';

const PasskeyList: FC = () => {
  const { passkeyList, appendPasskey, passkeyDelete, shortSession } = useCorbado();
  const [passkeys, setPasskeys] = useState<PassKeyList | undefined>();

  useEffect(() => {
    if (!shortSession) {
      return;
    }

    makeApiCallWithErrorHandler(passkeyList, setPasskeys);
  }, []);

  const handleAppendPasskey = async () => {
    await makeApiCallWithErrorHandler(appendPasskey);
    await makeApiCallWithErrorHandler(passkeyList, setPasskeys);
  };

  const handleDeletePasskey = async (id: string) => {
    await makeApiCallWithErrorHandler(() => passkeyDelete(id));
    await makeApiCallWithErrorHandler(passkeyList, setPasskeys);
  };

  if (!shortSession) {
    return <div>Not logged in</div>;
  }

  if (!passkeys) {
    return <Spinner />;
  }

  if (passkeys && passkeys.passkeys.length === 0) {
    return <div>No passkeys</div>;
  }

  return (
    <div>
      {passkeys.passkeys.map(passkey => (
        <div
          key={passkey.id}
          className='cb-passkey-list-card'
        >
          <PasskeyAgentIcon aaguid={passkey.aaguid} />
          <PasskeyDetails passkey={passkey} />
          <PasskeyDelete
            passkeyId={passkey.id}
            onPasskeyDelete={handleDeletePasskey}
          />
        </div>
      ))}
      <Button
        variant='primary'
        className='cb-passkey-list-primary-button'
        onClick={() => void handleAppendPasskey()}
      >
        Create Passkey
      </Button>
    </div>
  );
};

export default PasskeyList;
