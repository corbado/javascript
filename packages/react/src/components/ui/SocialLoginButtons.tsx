import type { SocialLogin } from '@corbado/shared-ui';
import type { SocialProviderType } from '@corbado/web-core';
import type { TFunction } from 'i18next';
import type { FC, ReactNode } from 'react';
import React from 'react';

import { IconButton } from './buttons/IconButton';
import { Divider } from './Divider';
import GithubIcon from './icons/GithubLogo';
import GoogleIcon from './icons/GoogleLogo';
import MicrosoftIcon from './icons/MicrosoftLogo';

export interface SocialLoginButtonsProps {
  dividerText?: string;
  socialLogins: SocialLogin[];
  t: TFunction;
  onClick: (providerType: SocialProviderType) => void;
}

const Icons: Record<string, ReactNode> = {
  github: <GithubIcon />,
  google: <GoogleIcon />,
  microsoft: <MicrosoftIcon />,
};

export const SocialLoginButtons: FC<SocialLoginButtonsProps> = ({ dividerText, socialLogins, t, onClick }) => {
  const socialLoginsAvailable = socialLogins.length > 0;
  const socialLoginButtonSize = socialLogins.length > 2 ? 'small' : 'large';

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
            className={`cb-social-login-buttton-${socialLoginButtonSize}`}
            icon={Icons[social.name] ?? null}
            label={t(`social_signup.${social.name}`)}
            onClick={() => onClick(social.name as SocialProviderType)}
            showIconOnly={socialLoginButtonSize === 'small'}
            labelProps={{
              level: '2',
              textColorVariant: 'primary',
            }}
            target='_blank'
          />
        ))}
      </div>
    </>
  );
};
