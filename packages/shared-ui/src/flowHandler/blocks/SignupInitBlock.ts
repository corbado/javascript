import type { CorbadoApp } from '@corbado/web-core';
import { AuthType } from '@corbado/web-core';
import type { GeneralBlockSignupInit, LoginIdentifier } from '@corbado/web-core/dist/api/v2';

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
    errorTranslator: ErrorTranslator,
    data: GeneralBlockSignupInit,
  ) {
    super(app, flowHandler);

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
      fullName = { value: data.fullName.value, translatedError: errorTranslator.translate(data.fullName.error) };
    }

    this.data = {
      fullName: fullName,
      email: email,
      phone: phone,
      userName: userName,
      socialLogins: [],
    };
  }

  async updateUserData(identifiers: LoginIdentifiers, _?: string) {
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

    const b = await this.app.authProcessService.initSignup(loginIdentifiers);
    this.updateBlock(b);
  }

  switchToLogin() {
    const newPrimary = this.alternatives[0];
    const newAlternatives = [this];
    this.updateBlockFrontend(newPrimary, newAlternatives);
  }
}
