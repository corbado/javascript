import type { AuthType } from '@corbado/web-core';
import { type BlockBody, BlockType, type CorbadoApp, type ProcessCommon, VerificationMethod } from '@corbado/web-core';

import { BlockTypes, ScreenNames, skipPasskeyAppendAfterHybridKey } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataEmailVerify, BlockDataPasskeyAppendAfterHybrid, PasskeyFallback } from '../types';
import { Block } from './Block';

export class PasskeyAppendAfterHybridBlock extends Block<BlockDataPasskeyAppendAfterHybrid> {
  readonly data: BlockDataPasskeyAppendAfterHybrid;
  readonly type = BlockTypes.PasskeyAppendAfterHybrid;
  readonly initialScreen = ScreenNames.PasskeyAppendAfterHybrid;
  readonly authType: AuthType;

  #passkeyAborted = false;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    blockBody: BlockBody,
  ) {
    super(app, flowHandler, common, errorTranslator);

    this.authType = blockBody.authType;

    this.data = {
      availableFallbacks: [],
    };
  }

  init() {
    let result: PasskeyFallback | undefined = undefined;

    this.data.availableFallbacks = this.alternatives
      .filter(a => a.type === BlockTypes.PhoneVerify || a.type === BlockType.EmailVerify)
      .map(alternative => {
        switch (alternative.type) {
          case BlockType.EmailVerify: {
            const typed = alternative.data as BlockDataEmailVerify;
            if (typed.verificationMethod === VerificationMethod.EmailOtp) {
              result = { label: 'button_switchToAlternate.emailOtp', action: () => this.initFallbackEmailOtp() };
            } else {
              result = { label: 'button_switchToAlternate.emailLink', action: () => this.initFallbackEmailLink() };
            }

            this.data.preferredFallbackOnSkip = result;
            return result;
          }
          case BlockType.PhoneVerify:
            result = { label: 'button_switchToAlternate.phone', action: () => this.initFallbackSmsOtp() };

            if (this.data.preferredFallbackOnSkip === undefined) {
              this.data.preferredFallbackOnSkip = result;
            }

            return result;
          default:
            throw new Error('Invalid block type');
        }
      });
  }

  // cancels the current passkey operation (if one has been started)
  // this should be called if a user leaves the passkey verify block without completing the passkey operation
  // (otherwise the operation will continue in the background and a passkey popup might occur much later when the user no longer expects it)
  cancelPasskeyOperation() {
    this.#passkeyAborted = true;
    return this.app.authProcessService.dispose();
  }

  async passkeyAppend() {
    this.#passkeyAborted = false;

    const res = await this.app.authProcessService.appendPasskey();
    if (res.err) {
      // This check is necessary because the user might have navigated away from the passkey block before the operation was completed
      if (!this.#passkeyAborted) {
        this.updateScreen(ScreenNames.PasskeyError);
      }
      return;
    }

    this.updateProcess(res);

    return;
  }

  async initFallbackEmailOtp(): Promise<void> {
    this.cancelPasskeyOperation();

    const newBlock = await this.app.authProcessService.startEmailCodeVerification();
    this.updateProcess(newBlock);

    return;
  }

  async initFallbackSmsOtp(): Promise<void> {
    this.cancelPasskeyOperation();

    const newBlock = await this.app.authProcessService.startPhoneOtpVerification();
    this.updateProcess(newBlock);

    return;
  }

  async initFallbackEmailLink(): Promise<void> {
    this.cancelPasskeyOperation();

    const newBlock = await this.app.authProcessService.startEmailLinkVerification();
    this.updateProcess(newBlock);

    return;
  }

  skipBlockInFuture() {
    localStorage.setItem(skipPasskeyAppendAfterHybridKey, 'true');
  }
}
