import type { CorbadoApp } from '@corbado/web-core';
import type { GeneralBlockVerifyIdentifier } from '@corbado/web-core/dist/api/v2';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { FlowHandler } from '../flowHandler';
import type { BlockDataEmailVerify } from '../types';
import { Block } from './Block';

export class EmailVerifyBlock extends Block<BlockDataEmailVerify> {
  readonly data: BlockDataEmailVerify;
  readonly type = BlockTypes.PasskeyAppend;
  readonly initialScreen;

  constructor(
    app: CorbadoApp,
    flowHandler: FlowHandler,
    translator: ErrorTranslator,
    data: GeneralBlockVerifyIdentifier,
  ) {
    super(app, flowHandler);

    switch (data.verificationMethod) {
      case 'sms-otp':
        throw new Error('SMS OTP verification is not supported for email verification');
      case 'email-link':
        this.initialScreen = ScreenNames.EmailLinkVerification;
        break;
      case 'email-otp':
        this.initialScreen = ScreenNames.EmailOTPVerification;
        break;
    }

    this.data = {
      email: data.identifier,
      translatedError: translator.translate(data.error),
      retryNotBefore: data.retryNotBefore,
    };
  }

  showEditEmail() {
    this.updateScreen(ScreenNames.PasskeyBenefits);
  }

  async validateCode(code: string) {
    const newBlock = await this.app.authProcessService.finishEmailCodeVerification(code);
    this.flowHandler.updateBlock(newBlock);

    return;
  }

  async resendCode() {
    const newBlock = await this.app.authProcessService.startEmailCodeVerification();
    this.flowHandler.updateBlock(newBlock);

    return;
  }
}
