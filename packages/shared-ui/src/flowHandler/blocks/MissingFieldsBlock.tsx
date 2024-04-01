import type { CorbadoApp, ProcessCommon } from '@corbado/web-core';
import type { AuthType } from '@corbado/web-core';
import type { BlockBody, GeneralBlockSignupInit, LoginIdentifier } from '@corbado/web-core/dist/api/v2';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataMissingFields, LoginIdentifiers, TextFieldWithError } from '../types';
import { Block } from './Block';

export class MissingFieldsBlock extends Block<BlockDataMissingFields> {
  readonly data: BlockDataMissingFields;
  readonly type = BlockTypes.MissingFields;
  readonly initialScreen = ScreenNames.MissingField;
  readonly authType: AuthType;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    blockBody: BlockBody,
  ) {
    super(app, flowHandler, common, errorTranslator);

    //This is only temporary, the type should be GeneralBlockMissingFields
    //TODO: Change the type to GeneralBlockMissingFields
    const data = blockBody.data as GeneralBlockSignupInit;

    let phone: TextFieldWithError | null = null;
    let userName: TextFieldWithError | null = null;

    data.identifiers.forEach(item => {
      switch (item.type) {
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

    this.authType = blockBody.authType;
    this.data = {
      phone: phone,
      userName: userName,
    };
  }

  async updateUserData(identifiers: Omit<LoginIdentifiers, 'email'>) {
    const loginIdentifiers: LoginIdentifier[] = [];
    if (identifiers.phone) {
      loginIdentifiers.push({ type: 'phone', identifier: identifiers.phone });
    }
    if (identifiers.userName) {
      loginIdentifiers.push({ type: 'username', identifier: identifiers.userName });
    }

    //This is only temporary, the method should be fillMissingFields
    //TODO: Change the method to fillMissingFields
    const b = await this.app.authProcessService.initSignup(loginIdentifiers);
    this.updateProcess(b);
  }
}
