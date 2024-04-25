import type { LoginInitBlock, TextFieldWithError } from '@corbado/shared-ui';
import type { SocialProviderType } from '@corbado/web-core';
import React, { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [textField, setTextField] = useState<TextFieldWithError | null>(null);
  const [usePhone, setUsePhone] = useState<boolean>(
    block.data.isPhoneFocused || !(block.data.emailEnabled || block.data.usernameEnabled),
  );
  const [phoneInput, setPhoneInput] = useState<string>('');
  const [socialLoadingInProgress, setSocialLoadingInProgress] = useState<boolean | undefined>(undefined);
  const [showLastIdentifier, setShowLastIdentifier] = useState<boolean>(false);

  const textFieldRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setLoading(false);

    if (block.data.lastIdentifier) {
      setShowLastIdentifier(true);
    }

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

    const shouldUsePhone = block.data.isPhoneFocused || !(block.data.emailEnabled || block.data.usernameEnabled);
    if (shouldUsePhone) {
      setUsePhone(true);
    }

    setTextField({ value: block.data.loginIdentifier, translatedError: block.data.loginIdentifierError });

    if (textFieldRef.current) {
      textFieldRef.current.focus();
      textFieldRef.current.value = block.data.loginIdentifier ? block.data.loginIdentifier : '';
    }

    void block.continueWithConditionalUI();

    return void 0;
  }, [block]);

  const headerText = useMemo(() => t('header'), [t]);
  const subheaderText = useMemo(() => t('subheader'), [t]);
  const signUpText = useMemo(() => t('text_signup'), [t]);
  const flowChangeButtonText = useMemo(() => t('button_signup'), [t]);
  const textDivider = useMemo(() => t('text_divider'), [t]);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);

      if (usePhone) {
        void block.start(phoneInput, true);
      } else {
        void block.start(textFieldRef.current?.value ?? '', false);
      }
    },
    [block, usePhone, phoneInput],
  );

  const startSocialLogin = (providerType: SocialProviderType) => {
    setSocialLoadingInProgress(true);
    void block.startSocialVerify(providerType);
  };

  return (
    <>
      <Header size='lg'>{headerText}</Header>
      <SubHeader>
        {subheaderText}
        {block.common.appName}
      </SubHeader>
      {showLastIdentifier ? (
        <LastIdentifier
          block={block}
          socialLoadingInProgress={socialLoadingInProgress}
          switchToLoginForm={() => setShowLastIdentifier(false)}
        />
      ) : (
        <LoginForm
          block={block}
          loading={loading}
          socialLoadingInProgress={socialLoadingInProgress}
          textField={textField}
          inputRef={textFieldRef}
          usePhone={usePhone}
          setUsePhone={setUsePhone}
          setPhoneInput={setPhoneInput}
          handleSubmit={handleSubmit}
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
    </>
  );
};
