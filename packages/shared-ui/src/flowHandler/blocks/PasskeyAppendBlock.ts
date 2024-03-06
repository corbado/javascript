import type {
  AuthType,
  BlockBody,
  CorbadoApp,
  GeneralBlockPasskeyAppend,
  GeneralBlockVerifyIdentifier,
  ProcessCommon,
} from '@corbado/web-core';
import { BlockType, VerificationMethod } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
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
    super(app, flowHandler, common);
    const data = blockBody.data as GeneralBlockPasskeyAppend;
    const alternatives = blockBody.alternatives ?? [];
    const error = blockBody.error;

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
    this.data = {
      availableFallbacks: fallbacks,
      userHandle: data.userHandle,
      translatedError: errorTranslator.translateWithIdentifier(error, 'email'),
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

    this.updateProcess(res.val);

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

  async updateEmail(value: string): Promise<void> {
    const newBlock = await this.app.authProcessService.updateEmail(value);

    if (!newBlock.blockBody.error) {
      this.updateScreen(ScreenNames.PasskeyAppend);
    }

    this.updateProcess(newBlock);

    return;
  }

  async updatePhone(value: string): Promise<void> {
    const newBlock = await this.app.authProcessService.updatePhone(value);

    if (!newBlock.blockBody.error) {
      this.updateScreen(ScreenNames.PasskeyAppend);
    }

    this.updateProcess(newBlock);

    return;
  }

  async updateUsername(value: string): Promise<void> {
    const newBlock = await this.app.authProcessService.updateUsername(value);

    if (!newBlock.blockBody.error) {
      this.updateScreen(ScreenNames.PasskeyAppend);
    }

    this.updateProcess(newBlock);

    return;
  }
}
