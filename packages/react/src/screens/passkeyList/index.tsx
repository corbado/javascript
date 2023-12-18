import { useCorbado } from '@corbado/react-sdk';
import type { PassKeyList } from '@corbado/types';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

import { Button, Spinner } from '../../components';
import CorbadoScreen from '../../hocs/CorbadoScreen';
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

    void fetchPasskeys();
  }, []);

  const fetchPasskeys = async () => {
    const result = await passkeyList();

    if (result.err) {
      throw new Error(result.val.name);
    }

    setPasskeys(result.val);
  };

  const handleAppendPasskey = async () => {
    await appendPasskey();
    await fetchPasskeys();
  };

  const handleDeletePasskey = async (id: string) => {
    await passkeyDelete(id);
    await fetchPasskeys();
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
    <CorbadoScreen>
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
        Create a Passkey
      </Button>
    </CorbadoScreen>
  );
};

export default PasskeyList;
