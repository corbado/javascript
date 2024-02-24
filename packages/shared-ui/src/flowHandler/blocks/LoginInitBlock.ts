import type { CorbadoApp, GeneralBlockLoginInit, LoginIdentifierWithError } from '@corbado/web-core';
import { LoginIdentifierType } from '@corbado/web-core';
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
    errorTranslator: ErrorTranslator,
    data: GeneralBlockLoginInit,
  ) {
    super(app, flowHandler);

    let loginIdentifier: string | undefined;
    let loginIdentifierError: string | undefined;
    let isPhone = undefined;
    let emailOrUsernameEnabled = false,
      phoneEnabled = false;

    data.identifiers.forEach((item: LoginIdentifierWithError) => {
      loginIdentifier = item.identifier;

      if (item.type === LoginIdentifierType.Email || item.type === LoginIdentifierType.Username) {
        emailOrUsernameEnabled = true;
      }

      if (item.type === LoginIdentifierType.Phone) {
        phoneEnabled = true;
      }

      if (item.identifier !== '' || item.error !== undefined) {
        loginIdentifier = item.identifier;
        loginIdentifierError = errorTranslator.translateWithIdentifier(item.error, item.type);
        isPhone = item.type === LoginIdentifierType.Phone;
      }
    });

    const first = data.identifiers[0];
    console.log('LoginInitBlock', phoneEnabled, emailOrUsernameEnabled);

    this.data = {
      loginIdentifier: loginIdentifier ?? first.identifier,
      loginIdentifierError: loginIdentifierError ?? '',
      isPhoneFocused: isPhone ?? first.type === LoginIdentifierType.Phone,

      emailOrUsernameEnabled: emailOrUsernameEnabled,
      phoneEnabled: phoneEnabled,
    };
  }

  async start(loginIdentifier: string, isPhone: boolean) {
    const b = await this.app.authProcessService.initLogin(loginIdentifier, isPhone);
    this.updateBlock(b);
  }

  switchToSignup() {
    const newPrimary = this.alternatives[0];
    const newAlternatives = [this];
    this.updateBlockFrontend(newPrimary, newAlternatives);
  }
}
