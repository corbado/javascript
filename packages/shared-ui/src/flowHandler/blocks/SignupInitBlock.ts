import type {
  CorbadoApp,
  GeneralBlockSignupInit,
  LoginIdentifier,
  ProcessCommon,
  SocialProviderType,
} from '@corbado/web-core';
import { SocialDataStatusEnum } from '@corbado/web-core';
import { AuthType } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataSignupInit, LoginIdentifiers, TextFieldWithError } from '../types';
import { Block } from './Block';

export class SignupInitBlock extends Block<BlockDataSignupInit> {
  readonly data: BlockDataSignupInit;
  readonly type = BlockTypes.SignupInit;
  readonly authType = AuthType.Signup;
  readonly initialScreen = ScreenNames.SignupInit;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    data: GeneralBlockSignupInit,
  ) {
    super(app, flowHandler, common, errorTranslator);

    let email: TextFieldWithError | null = null;
    let phone: TextFieldWithError | null = null;
    let userName: TextFieldWithError | null = null;
    let fullName: TextFieldWithError | null = null;

    data.identifiers.forEach(item => {
      switch (item.type) {
        case 'email':
          email = {
            value: item.identifier,
            translatedError: errorTranslator.translateWithIdentifier(item.error, item.type),
          };
          break;
        case 'phone':
          phone = {
            value: item.identifier,
            translatedError: errorTranslator.translateWithIdentifier(item.error, item.type),
          };
          break;
        case 'username':
          userName = {
            value: item.identifier,
            translatedError: errorTranslator.translateWithIdentifier(item.error, item.type),
          };
          break;
      }
    });

    if (data.fullName) {
      fullName = { value: data.fullName.fullName, translatedError: errorTranslator.translate(data.fullName.error) };
    }

    this.data = {
      fullName: fullName,
      email: email,
      phone: phone,
      userName: userName,
      socialData: {
        providers:
          data.socialData?.providers?.map(provider => {
            return { name: provider };
          }) || [],
        oAuthUrl: data.socialData?.oauthUrl,
        started: data.socialData?.status === SocialDataStatusEnum.Started || false,
        finished: data.socialData?.status === SocialDataStatusEnum.Finished || false,
      },
    };

    // errors in social logins should not be displayed in the login form (like we do for identifiers) but should appear on top of the screen
    if (data.socialData?.error) {
      this.setError(data.socialData.error);
    }
  }

  async startSocialVerify(providerType: SocialProviderType) {
    const redirectUrl = window.location.origin + window.location.pathname;
    const res = await this.app.authProcessService.startSocialVerification(providerType, redirectUrl, AuthType.Signup);
    if (!res) {
      return;
    }

    this.updateProcess(res);
  }

  async updateUserData(identifiers: LoginIdentifiers, fullName?: string) {
    const loginIdentifiers: LoginIdentifier[] = [];
    if (identifiers.email) {
      loginIdentifiers.push({ type: 'email', identifier: identifiers.email });
    }
    if (identifiers.phone) {
      loginIdentifiers.push({ type: 'phone', identifier: identifiers.phone });
    }
    if (identifiers.userName) {
      loginIdentifiers.push({ type: 'username', identifier: identifiers.userName });
    }

    const b = await this.app.authProcessService.initSignup(loginIdentifiers, fullName);
    this.updateProcess(b);
  }

  switchToLogin() {
    const newPrimary = this.alternatives[0];
    const newAlternatives = [this];
    this.updateProcessFrontend(newPrimary, newAlternatives);
  }

  async finishSocialVerification(abortController: AbortController) {
    const res = await this.app.authProcessService.finishSocialVerification(abortController);
    this.updateProcess(res);
  }
}
