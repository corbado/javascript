import type {
  AuthType,
  BlockBody,
  CorbadoApp,
  GeneralBlockPasskeyAppend,
  GeneralBlockVerifyIdentifier,
  ProcessCommon,
} from '@corbado/web-core';
import { BlockType, OnlyHybridPasskeyAvailableError, VerificationMethod } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataPasskeyVerify, PasskeyFallback } from '../types';
import { Block } from './Block';

export class PasskeyVerifyBlock extends Block<BlockDataPasskeyVerify> {
  readonly data: BlockDataPasskeyVerify;
  readonly type = BlockTypes.PasskeyVerify;
  readonly initialScreen = ScreenNames.PasskeyBackground;
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
    const data = blockBody.data as GeneralBlockPasskeyAppend;

    this.authType = blockBody.authType;
    this.data = {
      availableFallbacks: [],
      identifierValue: data.identifierValue,
    };
  }

  init() {
    this.data.availableFallbacks = this.alternatives
      .filter(a => a.type === BlockTypes.PhoneVerify || a.type === BlockType.EmailVerify)
      .map(alternative => {
        const typed = alternative.data as GeneralBlockVerifyIdentifier;
        let result: PasskeyFallback | undefined = undefined;

        if (!this.data.identifierValue) {
          this.data.identifierValue = typed.identifier;
        }

        switch (alternative.type) {
          case BlockType.EmailVerify: {
            if (typed.verificationMethod === VerificationMethod.EmailOtp) {
              result = { label: 'button_switchToAlternate.emailOtp', action: () => this.initFallbackEmailOtp() };
            } else {
              result = { label: 'button_switchToAlternate.emailLink', action: () => this.initFallbackEmailLink() };
            }

            this.data.preferredFallbackOnError = result;
            return result;
          }
          case BlockType.PhoneVerify:
            result = { label: 'button_switchToAlternate.phone', action: () => this.initFallbackSmsOtp() };

            if (this.data.preferredFallbackOnError === undefined) {
              this.data.preferredFallbackOnError = result;
            }

            return result;
          default:
            throw new Error('Invalid block type');
        }
      });
  }

  getFormattedPhoneNumber = () => Block.getFormattedPhoneNumber(this.data.identifierValue);

  async passkeyLogin(skipIfOnlyHybrid = false) {
    this.#passkeyAborted = false;

    const res = await this.app.authProcessService.loginWithPasskey(skipIfOnlyHybrid);
    if (res.err) {
      // This check is necessary because the user might have navigated away from the passkey block before the operation was completed
      if (!this.#passkeyAborted) {
        if (res.val instanceof OnlyHybridPasskeyAvailableError) {
          this.updateScreen(ScreenNames.PasskeyHybrid);
          return;
        }

        if (
          this.flowHandler.currentScreenName === ScreenNames.PasskeyBackground ||
          this.flowHandler.currentScreenName === ScreenNames.PasskeyHybrid
        ) {
          //In case of a first error, we show a different screen which has a lighter tone then the regular error screen
          //If the user tries again and fails, we show the regular error screen
          this.updateScreen(ScreenNames.PasskeyErrorLight);
        } else {
          this.updateScreen(ScreenNames.PasskeyError);
        }
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

  // cancels the current passkey operation (if one has been started)
  // this should be called if a user leaves the passkey verify block without completing the passkey operation
  // (otherwise the operation will continue in the background and a passkey popup might occur much later when the user no longer expects it)
  cancelPasskeyOperation() {
    this.#passkeyAborted = true;
    return this.app.authProcessService.dispose();
  }
}
