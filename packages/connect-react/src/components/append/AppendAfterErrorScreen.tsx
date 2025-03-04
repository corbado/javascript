import { ExcludeCredentialsMatchError, PasskeyChallengeCancelledError } from '@corbado/web-core';
import log from 'loglevel';
import React, { useCallback, useState } from 'react';

import useAppendProcess from '../../hooks/useAppendProcess';
import useShared from '../../hooks/useShared';
import { AppendScreenType } from '../../types/screenTypes';
import { AppendSituationCode, getAppendErrorMessage } from '../../types/situations';
import AppendAfterError from './append-init/AppendAfterError';

const AppendAfterErrorScreen = ({ attestationOptions }: { attestationOptions: string }) => {
  const { navigateToScreen, handleErrorSoft, handleErrorHard, handleCredentialExistsError, handleSkip } =
    useAppendProcess();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const { getConnectService } = useShared();

  const onSubmitClick = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    setErrorMessage(undefined);
    const res = await getConnectService().completeAppend(attestationOptions);
    if (res.err) {
      if (res.val instanceof ExcludeCredentialsMatchError) {
        return handleSituation(AppendSituationCode.ClientExcludeCredentialsMatch);
      }

      if (res.val instanceof PasskeyChallengeCancelledError) {
        return handleSituation(AppendSituationCode.ClientPasskeyOperationCancelled);
      }

      return handleSituation(AppendSituationCode.CboApiNotAvailablePostAuthenticator);
    }

    setLoading(false);
    navigateToScreen(AppendScreenType.Success, {
      aaguidName: res.val.passkeyOperation.aaguidDetails?.name,
      aaguidIcon: res.val.passkeyOperation.aaguidDetails?.iconLight,
    });
  };

  const handleSituation = (situationCode: AppendSituationCode) => {
    log.debug(`situation: ${situationCode}`);

    const message = getAppendErrorMessage(situationCode);
    if (message) {
      setErrorMessage(message);
    }

    switch (situationCode) {
      case AppendSituationCode.CtApiNotAvailablePreAuthenticator:
      case AppendSituationCode.CboApiNotAvailablePreAuthenticator:
      case AppendSituationCode.CboApiNotAvailablePostAuthenticator:
        void handleErrorHard(situationCode, false);
        break;
      case AppendSituationCode.ClientPasskeyOperationCancelled:
        setLoading(false);
        void handleErrorSoft(situationCode, true, true);
        break;
      case AppendSituationCode.ClientExcludeCredentialsMatch:
        void handleCredentialExistsError();
        break;
      case AppendSituationCode.ExplicitSkipByUser:
        void handleSkip(situationCode, true);
        break;
    }
  };

  const onSkip = useCallback(() => {
    if (skipping || loading) {
      return;
    }

    setSkipping(true);
    void handleSituation(AppendSituationCode.ExplicitSkipByUser);
  }, [skipping, loading]);

  return (
    <AppendAfterError
      appendLoading={loading}
      errorMessage={errorMessage}
      handleSubmit={() => void onSubmitClick()}
      handleSkip={onSkip}
    />
  );
};

export default AppendAfterErrorScreen;
