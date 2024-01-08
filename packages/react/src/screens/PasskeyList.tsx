import { useCorbado } from '@corbado/react-sdk';
import type { PassKeyList } from '@corbado/types';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Spinner } from '../components';
import PasskeyAgentIcon from '../components/passkeyList/PasskeyAgentIcon';
import PasskeyDelete from '../components/passkeyList/PasskeyDelete';
import PasskeyDetails from '../components/passkeyList/PasskeyDetails';

const PasskeyList: FC = () => {
  const { getPasskeys, appendPasskey, deletePasskey, shortSession } = useCorbado();
  const { t } = useTranslation('translation', { keyPrefix: 'passkeysList' });
  const [passkeys, setPasskeys] = useState<PassKeyList | undefined>();

  useEffect(() => {
    if (!shortSession) {
      return;
    }

    void fetchPasskeys();
  }, [shortSession]);

  const fetchPasskeys = async () => {
    const result = await getPasskeys();

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
    await deletePasskey(id);
    await fetchPasskeys();
  };

  if (!shortSession) {
    return <div>{t('warning_notLoggedIn')}</div>;
  }

  return (
    <div>
      {passkeys ? (
        passkeys.passkeys.map(passkey => (
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
        ))
      ) : (
        <Spinner />
      )}
      {passkeys && passkeys.passkeys.length === 0 ? <div>{t('message_noPasskeys')}</div> : null}
      <Button
        variant='primary'
        className='cb-passkey-list-primary-button'
        onClick={() => void handleAppendPasskey()}
      >
        {t('button_createPasskey')}
      </Button>
    </div>
  );
};

export default PasskeyList;
