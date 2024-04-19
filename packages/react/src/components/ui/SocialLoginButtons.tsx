import type { SocialLogin } from '@corbado/shared-ui';
import type { SocialProviderType } from '@corbado/web-core';
import type { TFunction } from 'i18next';
import type { FC, ReactNode } from 'react';
import React, { useEffect } from 'react';

import { IconButton } from './buttons/IconButton';
import { Divider } from './Divider';
import GithubIcon from './icons/GithubLogo';
import GoogleIcon from './icons/GoogleLogo';
import MicrosoftIcon from './icons/MicrosoftLogo';

export interface SocialLoginButtonsProps {
  dividerText?: string;
  socialLogins: SocialLogin[];
  t: TFunction;
  socialLoadingInProgress: boolean | undefined;
  onClick: (providerType: SocialProviderType) => void;
}

const socialLoginKey = 'socialLogin';

const Icons: Record<string, ReactNode> = {
  github: <GithubIcon />,
  google: <GoogleIcon />,
  microsoft: <MicrosoftIcon />,
};

export const SocialLoginButtons: FC<SocialLoginButtonsProps> = ({
  dividerText,
  socialLogins,
  t,
  socialLoadingInProgress,
  onClick,
}) => {
  const [loadingSocial, setLoadingSocial] = React.useState<string | undefined>();
  const socialLoginsAvailable = socialLogins.length > 0;
  const socialLoginButtonSize = socialLogins.length > 2 ? 'small' : 'large';

  useEffect(() => {
    if (socialLoadingInProgress) {
      const socialLogin = localStorage.getItem(socialLoginKey);
      if (socialLogin) {
        setLoadingSocial(socialLogin);
      }
    } else if (socialLoadingInProgress === false) {
      setLoadingSocial(undefined);
      localStorage.removeItem(socialLoginKey);
    }
  }, [socialLoadingInProgress]);

  const handleSocialLoginClick = (socialName: string) => {
    localStorage.setItem(socialLoginKey, socialName);
    setLoadingSocial(socialName);

    onClick(socialName as SocialProviderType);
  };

  if (!socialLoginsAvailable) {
    return null;
  }

  return (
    <>
      <Divider
        label={dividerText ?? ''}
        className='cb-social-login-divider'
      />
      <div className={`cb-social-login-buttons-section cb-social-login-buttons-section-${socialLoginButtonSize}`}>
        {socialLogins.map(social => (
          <IconButton
            key={social.name}
            icon={Icons[social.name] ?? null}
            label={t(`social_signup.${social.name}`) || t(`social_signup.default`, social.name)}
            onClick={() => handleSocialLoginClick(social.name)}
            showIconOnly={socialLoginButtonSize === 'small'}
            disabled={!!(loadingSocial && loadingSocial !== social.name)}
            loading={loadingSocial === social.name}
            labelProps={{
              level: '2',
              textColorVariant: 'primary',
            }}
          />
        ))}
      </div>
    </>
  );
};
