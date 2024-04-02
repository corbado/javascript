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
    errorTranslator: ErrorTranslator,
    blockBody: BlockBody,
  ) {
    super(app, flowHandler, common, errorTranslator);

    const data = blockBody.data as GeneralBlockVerifyIdentifier;

    this.authType = blockBody.authType;
    this.data = {
      phone: data.identifier,
      translatedError: errorTranslator.translate(data.error),
      retryNotBefore: data.retryNotBefore,
    };
  }

  getFormattedPhoneNumber = () => Block.getFormattedPhoneNumber(this.data.phone);

  showEditPhone() {
    this.updateScreen(ScreenNames.EditPhone);
  }

  showPhoneOtpScreen() {
    this.updateScreen(ScreenNames.PhoneOtp);
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

  async updatePhone(value: string): Promise<string | undefined> {
    const newBlock = await this.app.authProcessService.updatePhone(value);

    if (newBlock.err) {
      this.updateProcess(newBlock);
      return;
    }

    const error = newBlock.val.blockBody.error;

    //If the new phone number is invalid, we don't want to update the block because the new block data from BE has no indicator for ScreenNames.EditPhone
    //So, the FE needs to maintain state and we just  want to show the translated error message
    if (error) {
      return this.errorTranslator.translateWithIdentifier(error, 'phone');
    }

    await this.resendCode();
    this.showPhoneOtpScreen();

    return;
  }
}
