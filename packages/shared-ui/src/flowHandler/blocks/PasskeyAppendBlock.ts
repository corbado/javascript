import type {
  BlockBody,
  CorbadoApp,
  GeneralBlockPasskeyAppend,
  GeneralBlockVerifyIdentifier,
  ProcessCommon,
} from '@corbado/web-core';
import { AuthType, BlockType, VerificationMethod } from '@corbado/web-core';

import { BlockTypes, createLoginIdentifierType, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataPasskeyAppend } from '../types';
import { Block } from './Block';

export class PasskeyAppendBlock extends Block<BlockDataPasskeyAppend> {
  readonly data: BlockDataPasskeyAppend;
  readonly type = BlockTypes.PasskeyAppend;
  readonly initialScreen = ScreenNames.PasskeyAppend;
  readonly authType: AuthType;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    blockBody: BlockBody,
  ) {
    super(app, flowHandler, common, errorTranslator);
    const data = blockBody.data as GeneralBlockPasskeyAppend;
    const alternatives = blockBody.alternatives ?? [];

    const fallbacks = alternatives
      .filter(a => a.block === BlockType.PhoneVerify || a.block === BlockType.EmailVerify)
      .map(alternative => {
        switch (alternative.block) {
          case BlockType.EmailVerify: {
            const typed = alternative.data as GeneralBlockVerifyIdentifier;
            if (typed.verificationMethod === VerificationMethod.EmailOtp) {
              return { label: 'button_switchToAlternate.emailOtp', action: () => this.initFallbackEmailOtp() };
            }

            return { label: 'button_switchToAlternate.emailLink', action: () => this.initFallbackEmailLink() };
          }
          case BlockType.PhoneVerify:
            return { label: 'button_switchToAlternate.phone', action: () => this.initFallbackSmsOtp() };
          default:
            throw new Error('Invalid block type');
        }
      });

    // if there is a completed alternative, the passkey-append block can be skipped and the user can log in immediately
    const canBeSkipped = alternatives.some(a => a.block === BlockType.Completed);

    this.authType = blockBody.authType;
    const userHandleType = createLoginIdentifierType(data.identifierType);

    if (this.authType === AuthType.Login) {
      app.authProcessService.dropPasskeyAppendShown();
    }

    this.data = {
      availableFallbacks: fallbacks,
      userHandle: data.identifierValue,
      userHandleType,
      canBeSkipped,
    };
  }

  showPasskeyBenefits() {
    this.updateScreen(ScreenNames.PasskeyBenefits);
  }

  showEditUserData() {
    this.updateScreen(ScreenNames.EditUserData);
  }

  showPasskeyAppend() {
    this.updateScreen(ScreenNames.PasskeyAppend);
  }

  async passkeyAppend() {
    const res = await this.app.authProcessService.appendPasskey();
    if (res.err) {
      this.updateScreen(ScreenNames.PasskeyError);
      return;
    }

    this.updateProcess(res);

    return;
  }

  async initFallbackEmailOtp(): Promise<void> {
    const newBlock = await this.app.authProcessService.startEmailCodeVerification();
    this.updateProcess(newBlock);

    return;
  }

  async initFallbackSmsOtp(): Promise<void> {
    const newBlock = await this.app.authProcessService.startPhoneOtpVerification();
    this.updateProcess(newBlock);

    return;
  }

  async skipPasskeyAppend(): Promise<void> {
    const newBlock = await this.app.authProcessService.finishAuthProcess();
    this.updateProcess(newBlock);

    return;
  }

  async initFallbackEmailLink(): Promise<void> {
    const newBlock = await this.app.authProcessService.startEmailLinkVerification();
    this.updateProcess(newBlock);

    return;
  }

  async updateEmail(value: string): Promise<string | undefined> {
    const newBlock = await this.app.authProcessService.updateEmail(value);

    if (newBlock.err) {
      this.updateProcess(newBlock);
      return;
    }

    const error = newBlock.val.blockBody.error;

    //If the new email is invalid, we don't want to update the block because the new block data from BE has no indicator for ScreenNames.EditUserInfo
    //So, the FE needs to maintain state and we just  want to show the translated error message
    if (error) {
      return this.errorTranslator.translateWithIdentifier(error, 'email');
    }

    this.updateProcess(newBlock);
    this.showPasskeyAppend();

    return;
  }

  async updatePhone(value: string): Promise<string | undefined> {
    const newBlock = await this.app.authProcessService.updatePhone(value);

    if (newBlock.err) {
      this.updateProcess(newBlock);
      return;
    }

    const error = newBlock.val.blockBody.error;

    //If the new phone number is invalid, we don't want to update the block because the new block data from BE has no indicator for ScreenNames.EditUserInfo
    //So, the FE needs to maintain state and we just  want to show the translated error message
    if (error) {
      return this.errorTranslator.translateWithIdentifier(error, 'phone');
    }

    this.updateProcess(newBlock);
    this.showPasskeyAppend();

    return;
  }

  async updateUsername(value: string): Promise<void> {
    const newBlock = await this.app.authProcessService.updateUsername(value);

    if (newBlock.ok && !newBlock.val.blockBody.error) {
      this.updateScreen(ScreenNames.PasskeyAppend);
    }

    this.updateProcess(newBlock);

    return;
  }
}
