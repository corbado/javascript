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
import type { BlockDataPasskeyVerify } from '../types';
import { Block } from './Block';

export class PasskeyVerifyBlock extends Block<BlockDataPasskeyVerify> {
  readonly data: BlockDataPasskeyVerify;
  readonly type = BlockTypes.PasskeyVerify;
  readonly initialScreen = ScreenNames.PasskeyBackground;
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
    let identifierValue = data.identifierValue;

    const fallbacks = alternatives
      .filter(a => a.block === BlockType.PhoneVerify || a.block === BlockType.EmailVerify)
      .map(alternative => {
        const typed = alternative.data as GeneralBlockVerifyIdentifier;

        if (!identifierValue) {
          identifierValue = typed.identifier;
        }

        switch (alternative.block) {
          case BlockType.EmailVerify: {
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

    this.authType = blockBody.authType;
    this.data = {
      availableFallbacks: fallbacks,
      identifierValue: identifierValue,
    };
  }

  showPasskeyBenefits() {
    this.updateScreen(ScreenNames.PasskeyBenefits);
  }

  async passkeyLogin() {
    const res = await this.app.authProcessService.loginWithPasskey();
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

  async initFallbackEmailLink(): Promise<void> {
    const newBlock = await this.app.authProcessService.startEmailLinkVerification();
    this.updateProcess(newBlock);

    return;
  }
}
