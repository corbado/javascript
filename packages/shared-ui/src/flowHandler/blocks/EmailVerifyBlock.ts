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

    const translatedError = blockBody.error
      ? translator.translateWithIdentifier(blockBody.error, 'email')
      : translator.translate(data.error);

    this.data = {
      email: data.identifier,
      translatedError: translatedError,
      retryNotBefore: data.retryNotBefore,
    };
  }

  showEditEmail() {
    this.data.translatedError = undefined;
    this.updateScreen(ScreenNames.EditEmail);
  }

  showEmailVerificationScreen() {
    this.data.translatedError = undefined;
    if (this.verificationMethod === 'email-otp') {
      this.updateScreen(ScreenNames.EmailOtpVerification);
    } else {
      this.updateScreen(ScreenNames.EmailLinkSent);
    }
  }

  async validateCode(code: string) {
    const processUpdate = await this.app.authProcessService.finishEmailCodeVerification(code);
    this.updateProcess(processUpdate);

    return;
  }

  async resendCode() {
    if (this.verificationMethod === 'email-otp') {
      const newBlock = await this.app.authProcessService.startEmailCodeVerification();
      this.updateProcess(newBlock);
    } else {
      const newBlock = await this.app.authProcessService.startEmailLinkVerification();
      this.updateProcess(newBlock);
    }

    return;
  }

  async updateEmail(value: string): Promise<void> {
    const newBlock = await this.app.authProcessService.updateEmail(value);

    if (!newBlock.blockBody.error) {
      this.showEmailVerificationScreen();
      void this.resendCode();
    }

    this.updateProcess(newBlock);

    return;
  }
}
