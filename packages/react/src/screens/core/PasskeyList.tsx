import { useCorbado } from '@corbado/react-sdk';
import type { PassKeyList } from '@corbado/types';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  PasskeyAgentIcon,
  PasskeyCreate,
  PasskeyDelete,
  PasskeyDetails,
  PasskeyListErrorBoundary,
  Spinner,
} from '../../components';

const PasskeyList: FC = () => {
  const { getPasskeys, appendPasskey, deletePasskey, shortSession, globalError } = useCorbado();
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
    const result = await appendPasskey();

    if (result.ok) {
      await fetchPasskeys();
    }

    return result;
  };

  const handleDeletePasskey = async (id: string) => {
    await deletePasskey(id);
    await fetchPasskeys();
  };

  if (!shortSession) {
    return <div>{t('warning_notLoggedIn')}</div>;
  }

  return (
    <PasskeyListErrorBoundary globalError={globalError}>
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
      <PasskeyCreate handlerPasskeyCreate={handleAppendPasskey} />
    </PasskeyListErrorBoundary>
  );
};

export default PasskeyList;
