import type { AuthType, BlockBody, CorbadoApp, ProcessCommon } from '@corbado/web-core';
import type { GeneralBlockVerifyIdentifier } from '@corbado/web-core/dist/api/v2';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataPhoneVerify } from '../types';
import { Block } from './Block';

export class PhoneVerifyBlock extends Block<BlockDataPhoneVerify> {
  readonly data: BlockDataPhoneVerify;
  readonly type = BlockTypes.PhoneVerify;
  readonly initialScreen = ScreenNames.PhoneOtp;
  readonly authType: AuthType;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    translator: ErrorTranslator,
    blockBody: BlockBody,
  ) {
    super(app, flowHandler, common);

    const data = blockBody.data as GeneralBlockVerifyIdentifier;

    this.authType = blockBody.authType;
    this.data = {
      phone: data.identifier,
      translatedError: translator.translate(data.error),
      retryNotBefore: data.retryNotBefore,
    };
  }

  showEditPhone() {
    this.updateScreen(ScreenNames.PasskeyBenefits);
  }

  async validateCode(code: string) {
    const newBlock = await this.app.authProcessService.finishPhoneOtpVerification(code);
    this.updateProcess(newBlock);

    return;
  }

  async resendCode() {
    const newBlock = await this.app.authProcessService.startPhoneOtpVerification();
    this.updateProcess(newBlock);

    return;
  }
}
