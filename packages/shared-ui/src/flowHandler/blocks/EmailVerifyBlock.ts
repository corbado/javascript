import type {
  AuthType,
  CorbadoApp,
  CorbadoError,
  GeneralBlockVerifyIdentifier,
  ProcessCommon,
} from '@corbado/web-core';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

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
  readonly isNewDevice: boolean;
  readonly emailLinkToken?: string;
  readonly continueOnOtherDevice: boolean;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    translator: ErrorTranslator,
    data: GeneralBlockVerifyIdentifier,
    authType: AuthType,
    fromEmailVerifyFromUrl: boolean,
    isNewDevice: boolean,
    continueOnOtherDevice: boolean,
    emailLinkToken?: string,
  ) {
    super(app, flowHandler, common);

    switch (data.verificationMethod) {
      case 'sms-otp':
        throw new Error('SMS OTP verification is not supported for email verification');
      case 'email-link':
        if (fromEmailVerifyFromUrl) {
          this.initialScreen = ScreenNames.EmailLinkVerification;
        } else {
          this.initialScreen = ScreenNames.EmailLinkSent;
        }
        break;
      case 'email-otp':
        this.initialScreen = ScreenNames.EmailOtpVerification;
        break;
    }

    this.verificationMethod = data.verificationMethod;
    this.authType = authType;
    this.isNewDevice = isNewDevice;
    this.emailLinkToken = emailLinkToken;
    this.continueOnOtherDevice = continueOnOtherDevice;

    this.data = {
      email: data.identifier,
      translatedError: translator.translate(data.error),
      retryNotBefore: data.retryNotBefore,
    };
  }

  static fromBackend(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    translator: ErrorTranslator,
    data: GeneralBlockVerifyIdentifier,
    authType: AuthType,
    continueOnOtherDevice: boolean,
  ): EmailVerifyBlock {
    return new EmailVerifyBlock(
      app,
      flowHandler,
      common,
      translator,
      data,
      authType,
      false,
      false,
      continueOnOtherDevice,
    );
  }

  static fromUrl(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    translator: ErrorTranslator,
    data: GeneralBlockVerifyIdentifier,
    authType: AuthType,
    isNewDevice: boolean,
    emailLinkToken: string,
  ): EmailVerifyBlock {
    const emptyCommon = {
      appName: '',
    };

    return new EmailVerifyBlock(
      app,
      flowHandler,
      emptyCommon,
      translator,
      data,
      authType,
      true,
      isNewDevice,
      false,
      emailLinkToken,
    );
  }

  showEditEmail() {
    this.updateScreen(ScreenNames.PasskeyBenefits);
  }

  async validateCode(code: string) {
    const processUpdate = await this.app.authProcessService.finishEmailCodeVerification(code);
    this.updateProcess(processUpdate);

    return;
  }

  async resendEmail() {
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
    this.updateProcess(newBlock);

    return;
  }

  async validateEmailLink(abortController: AbortController): Promise<Result<void, CorbadoError>> {
    if (!this.emailLinkToken) {
      throw new Error('Email link token is missing');
    }

    const res = await this.app.authProcessService.finishEmailLinkVerification(
      abortController,
      this.emailLinkToken,
      this.isNewDevice,
    );

    this.updateProcess(res);

    return Ok(void 0);
  }

  async getVerificationStatus(): Promise<Result<boolean, CorbadoError>> {
    const newBlock = await this.app.authProcessService.getVerificationStatus();
    if (newBlock.err) {
      return newBlock;
    }

    // unlike all other requests blocks, this request's response is not always piped through updateProcess
    // reason for that is that we don't want to refresh the whole screen after each poll (this would cause the counter to jump unpredictably due to network latency)
    if (newBlock.val.blockBody.continueOnOtherDevice !== undefined) {
      return Ok(true);
    }

    if (newBlock.val.blockBody.block === BlockTypes.EmailVerify) {
      return Ok(false);
    }

    this.updateProcess(newBlock.val);

    return Ok(false);
  }
}
