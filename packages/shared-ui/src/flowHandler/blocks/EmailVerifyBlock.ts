import type { AuthType, BlockBody, CorbadoApp, GeneralBlockVerifyIdentifier, ProcessCommon } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataEmailVerify } from '../types';
import { Block } from './Block';

export class EmailVerifyBlock extends Block<BlockDataEmailVerify> {
  readonly data: BlockDataEmailVerify;
  readonly type = BlockTypes.EmailVerify;
  readonly initialScreen;
  readonly authType: AuthType;
  readonly verificationMethod: 'email-otp' | 'email-link';

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    translator: ErrorTranslator,
    blockBody: BlockBody,
  ) {
    super(app, flowHandler, common);

    const data = blockBody.data as GeneralBlockVerifyIdentifier;
    switch (data.verificationMethod) {
      case 'sms-otp':
        throw new Error('SMS OTP verification is not supported for email verification');
      case 'email-link':
        this.initialScreen = ScreenNames.EmailLinkSent;
        break;
      case 'email-otp':
        this.initialScreen = ScreenNames.EmailOtpVerification;
        break;
    }

    this.verificationMethod = data.verificationMethod;
    this.authType = blockBody.authType;

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
    const processUpdate = await this.app.authProcessService.finishEmailCodeVerification(code);
    this.updateProcess(processUpdate);

    return;
  }

  async resendCode() {
    console.log('this.verificationMethod', this.verificationMethod);

    if (this.verificationMethod === 'email-otp') {
      const newBlock = await this.app.authProcessService.startEmailCodeVerification();
      this.updateProcess(newBlock);
    } else {
      const newBlock = await this.app.authProcessService.startEmailLinkVerification();
      this.updateProcess(newBlock);
    }

    return;
  }
}
