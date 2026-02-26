import type { LoginMethodType } from '@corbado/observe';

import type { SocialLogin } from '../flowHandler';

export const providersToSocialLoginMethods = (providers: SocialLogin[]): LoginMethodType[] => {
  return providers.map(provider => {
    switch (provider.name) {
      case 'google':
        return 'social-google';
      case 'microsoft':
        return 'social-microsoft';
      case 'github':
        return 'social-github';
      default:
        return 'social-other';
    }
  }) as LoginMethodType[];
};
