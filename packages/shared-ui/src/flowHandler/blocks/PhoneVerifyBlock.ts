import type { CorbadoApp } from '@corbado/web-core';
import type { GeneralBlockVerifyIdentifier } from '@corbado/web-core/dist/api/v2';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { FlowHandler } from '../flowHandler';
import type { BlockDataPhoneVerify } from '../types';
import { Block } from './Block';

export class PhoneVerifyBlock extends Block<BlockDataPhoneVerify> {
  readonly data: BlockDataPhoneVerify;
  readonly type = BlockTypes.PhoneVerify;
  readonly initialScreen = ScreenNames.PhoneOtp;

  constructor(
    app: CorbadoApp,
    flowHandler: FlowHandler,
    translator: ErrorTranslator,
    data: GeneralBlockVerifyIdentifier,
  ) {
    super(app, flowHandler);

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
    this.flowHandler.updateBlock(newBlock);

    return;
  }

  async resendCode() {
    const newBlock = await this.app.authProcessService.startPhoneOtpVerification();
    this.flowHandler.updateBlock(newBlock);

    return;
  }
}
