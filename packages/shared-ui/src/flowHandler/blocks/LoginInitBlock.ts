import type { CorbadoApp, GeneralBlockLoginInit, ProcessCommon } from '@corbado/web-core';
import { AuthType, PasskeyChallengeCancelledError } from '@corbado/web-core';
import type { SocialProviderType } from '@corbado/web-core/dist/api/v2';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataLoginInit } from '../types';
import { Block } from './Block';

export class LoginInitBlock extends Block<BlockDataLoginInit> {
  readonly data: BlockDataLoginInit;
  readonly type = BlockTypes.LoginInit;
  readonly authType = AuthType.Login;
  readonly initialScreen = ScreenNames.LoginInit;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    data: GeneralBlockLoginInit,
  ) {
    super(app, flowHandler, common, errorTranslator);

    const loginIdentifierError = errorTranslator.translate(data.error);

    this.data = {
      loginIdentifier: data.identifierValue ?? '',
      loginIdentifierError: loginIdentifierError ?? '',
      isPhoneFocused: data.isPhone,
      emailEnabled: data.isEmailAvailable,
      usernameEnabled: data.isUsernameAvailable,
      phoneEnabled: data.isPhoneAvailable,
      conditionalUIChallenge: data.conditionalUIChallenge,
      socialLogins: data.socialProviders.map(provider => {
        return { name: provider };
      }),
    };
  }

  async startSocialVerify(providerType: SocialProviderType) {
    const res = await this.app.authProcessService.startSocialVerification(providerType);
    this.updateProcess(res);
  }

  async start(loginIdentifier: string, isPhone: boolean) {
    const b = await this.app.authProcessService.initLogin(loginIdentifier, isPhone);
    this.updateProcess(b);
  }

  switchToSignup() {
    const newPrimary = this.alternatives[0];
    const newAlternatives = [this];
    this.updateProcessFrontend(newPrimary, newAlternatives);
  }

  isSignupEnabled() {
    return this.alternatives.filter(b => b.type === BlockTypes.SignupInit).length > 0;
  }

  async continueWithConditionalUI() {
    if (!this.data.conditionalUIChallenge) {
      return;
    }

    const b = await this.app.authProcessService.loginWithPasskeyChallenge(this.data.conditionalUIChallenge);
    if (b.err && b.val instanceof PasskeyChallengeCancelledError) {
      // we ignore this type of error
      return;
    }

    this.updateProcess(b);
  }
}
