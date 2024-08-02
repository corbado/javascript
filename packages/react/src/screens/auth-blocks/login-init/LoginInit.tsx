import type { LoginInitBlock } from '@corbado/shared-ui';
import type { SocialProviderType } from '@corbado/web-core';
import log from 'loglevel';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LastIdentifier } from '../../../components/authentication/login-init/LastIdentifier';
import { LoginForm } from '../../../components/authentication/login-init/LoginForm';
import { SecondaryButton } from '../../../components/ui/buttons/SecondaryButton';
import { SocialLoginButtons } from '../../../components/ui/SocialLoginButtons';
import { Header } from '../../../components/ui/typography/Header';
import { SubHeader } from '../../../components/ui/typography/SubHeader';
import { Text } from '../../../components/ui/typography/Text';

export const LoginInit = ({ block }: { block: LoginInitBlock }) => {
  const { t } = useTranslation('translation', { keyPrefix: `login.login-init.login-init` });
  const [loading, setLoading] = useState<boolean>(false);
  const [socialLoadingInProgress, setSocialLoadingInProgress] = useState<boolean | undefined>(undefined);
  const [showLastIdentifier, setShowLastIdentifier] = useState<boolean>(!!block.data.lastIdentifier);
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const [onComponentClick, setOnComponentClick] = useState<() => void>(() => {});

  useEffect(() => {
    setLoading(false);

    if (block.data.socialData.finished && !block.error) {
      const socialAbort = new AbortController();
      void block.finishSocialVerify(socialAbort).finally(() => setSocialLoadingInProgress(false));
      setSocialLoadingInProgress(true);

      return () => {
        socialAbort.abort();
      };
    } else {
      setSocialLoadingInProgress(false);
    }

    if (block.data.loginIdentifierError) {
      setShowLastIdentifier(false);
    }

    return void 0;
  }, [block]);

  // we have to be very careful with conditionalUI as WebKit based browser historically had a number of "restrictions" on how we can start it
  useEffect(() => {
    void block.startConditionalUIOnPageLoad().then(result => {
      if (result) {
        log.debug('CUI: page load');
        void block.continueWithConditionalUI({ onLoadingStateChange: setLoading });
      }
    });

    void block.startConditionalUIOnFirstUserInteraction().then(result => {
      if (result) {
        log.debug('CUI: first click');
        setOnComponentClick(() => {
          return () => {
            log.debug('calling continueWithConditionalUI');
            void block.continueWithConditionalUI({ onLoadingStateChange: setLoading });
          };
        });
      }
    });
  }, []);

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t('subheader'), [t]);
  const signUpText = useMemo(() => t('text_signup'), [t]);
  const flowChangeButtonText = useMemo(() => t('button_signup'), [t]);
  const textDivider = useMemo(() => t('text_divider'), [t]);

  const startSocialLogin = (providerType: SocialProviderType) => {
    setSocialLoadingInProgress(true);
    void block.startSocialVerify(providerType);
  };

  // user explicitly discards the last identifier offered to him => we will clear if from localstorage
  const discardOfferedLastIdentifier = () => {
    block.discardOfferedLastIdentifier();
    setShowLastIdentifier(false);
  };

  return (
    <div
      onClick={onComponentClick}
      className='cb-login-init'
    >
      <Header size='lg'>{headerText}</Header>
      <SubHeader>
        {subheaderText}
        {block.common.appName}
      </SubHeader>
      {showLastIdentifier ? (
        <LastIdentifier
          block={block}
          socialLoadingInProgress={socialLoadingInProgress}
          loading={loading}
          setLoading={setLoading}
          switchToLoginForm={discardOfferedLastIdentifier}
        />
      ) : (
        <LoginForm
          block={block}
          loading={loading}
          socialLoadingInProgress={socialLoadingInProgress}
          setLoading={setLoading}
        />
      )}
      <SocialLoginButtons
        dividerText={textDivider}
        socialLogins={block.data.socialData.providers}
        t={t}
        socialLoadingInProgress={socialLoadingInProgress}
        onClick={startSocialLogin}
      />
      {block.isSignupEnabled() && (
        <Text
          level='2'
          fontWeight='normal'
          textColorVariant='script'
          className='cb-auth-change-section'
        >
          {signUpText}
          <SecondaryButton
            colorVariant='link'
            disabled={loading}
            onClick={() => block.switchToSignup()}
          >
            {flowChangeButtonText}
          </SecondaryButton>
        </Text>
      )}
    </div>
  );
};
