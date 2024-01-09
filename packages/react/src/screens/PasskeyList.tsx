import { useCorbado } from '@corbado/react-sdk';
import type { PassKeyList } from '@corbado/types';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Spinner } from '../components';
import PasskeyAgentIcon from '../components/passkeyList/PasskeyAgentIcon';
import PasskeyCreate from '../components/passkeyList/PasskeyCreate';
import PasskeyDelete from '../components/passkeyList/PasskeyDelete';
import PasskeyDetails from '../components/passkeyList/PasskeyDetails';

const PasskeyList: FC = () => {
  const { getPasskeys, appendPasskey, deletePasskey, shortSession } = useCorbado();
  const { t } = useTranslation('translation', { keyPrefix: 'passkeysList' });
  const [passkeys, setPasskeys] = useState<PassKeyList | undefined>();
  const [passkeyAppendError, setPasskeyAppendError] = useState<string | undefined>();

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
    const result = await appendPasskey();
    if (result.err) {
      setPasskeyAppendError(result.val?.name);
      return;
    }
    await fetchPasskeys();
  };

  const clearPasskeyAppendError = () => {
    setPasskeyAppendError(undefined);
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
      <PasskeyCreate
        handlerPasskeyCreate={handleAppendPasskey}
        passkeyCreateError={passkeyAppendError}
        clearPasskeyCreateError={clearPasskeyAppendError}
      />
    </div>
  );
};

export default PasskeyList;
