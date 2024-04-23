import type { PassKeyList } from '@corbado/types';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingSpinner, PasskeyCreate, PasskeyListErrorBoundary, PasskeyListItem } from '../../components';
import { useCorbado } from '../../hooks/useCorbado';

const PasskeyList: FC = () => {
  const { getPasskeys, globalError, isAuthenticated } = useCorbado();
  const { t } = useTranslation('translation', { keyPrefix: 'passkey-list' });
  const [passkeys, setPasskeys] = useState<PassKeyList | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const abortController = new AbortController();
    void fetchPasskeys(abortController);
    return () => {
      abortController.abort();
    };
  }, [isAuthenticated]);

  const fetchPasskeys = useCallback(
    async (abortController?: AbortController) => {
      setLoading(true);
      const result = await getPasskeys(abortController);
      if (result.err && result.val.ignore) {
        return;
      }

      if (result.err) {
        throw new Error(result.val.name);
      }

      setPasskeys(result.val);
      setLoading(false);
    },
    [getPasskeys],
  );

  if (!isAuthenticated) {
    return <div>{t('warning_notLoggedIn')}</div>;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PasskeyListErrorBoundary globalError={globalError}>
      {passkeys?.passkeys.map(passkey => (
        <PasskeyListItem
          key={passkey.id}
          passkey={passkey}
          fetchPasskeys={fetchPasskeys}
        ></PasskeyListItem>
      )) ?? <div>{t('message_noPasskeys')}</div>}
      <PasskeyCreate fetchPasskeys={fetchPasskeys} />
    </PasskeyListErrorBoundary>
  );
};

export default PasskeyList;
