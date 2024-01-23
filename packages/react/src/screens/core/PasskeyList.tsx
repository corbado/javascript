import { useCorbado } from '@corbado/react-sdk';
import type { PassKeyList } from '@corbado/types';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { PasskeyCreate, PasskeyListErrorBoundary, PasskeyListItem, Spinner } from '../../components';

const PasskeyList: FC = () => {
  const { getPasskeys, globalError, isAuthenticated } = useCorbado();
  const { t } = useTranslation('translation', { keyPrefix: 'passkeysList' });
  const [passkeys, setPasskeys] = useState<PassKeyList | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void fetchPasskeys();
  }, [isAuthenticated]);

  const fetchPasskeys = useCallback(async () => {
    setLoading(true);
    const result = await getPasskeys();

    if (result.err) {
      throw new Error(result.val.name);
    }

    setPasskeys(result.val);
    setLoading(false);
  }, [getPasskeys]);

  if (!isAuthenticated) {
    return <div>{t('warning_notLoggedIn')}</div>;
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <PasskeyListErrorBoundary globalError={globalError}>
      {passkeys?.passkeys.map(passkey => (
        <PasskeyListItem
          key={passkey.aaguid}
          passkey={passkey}
          fetchPasskeys={fetchPasskeys}
        ></PasskeyListItem>
      )) ?? <div>{t('message_noPasskeys')}</div>}
      <PasskeyCreate fetchPasskeys={fetchPasskeys} />
    </PasskeyListErrorBoundary>
  );
};

export default PasskeyList;
