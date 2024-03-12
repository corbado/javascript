import type { CorbadoApp, GeneralBlockLoginInit, ProcessCommon } from '@corbado/web-core';
import { AuthType } from '@corbado/web-core';

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
      emailOrUsernameEnabled: data.isEmailUsernameAvailable,
      phoneEnabled: data.isPhoneAvailable,
    };
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
}
