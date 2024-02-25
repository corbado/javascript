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
    _: ErrorTranslator,
    blockBody: BlockBody,
  ) {
    super(app, flowHandler, common);
    const data = blockBody.data as GeneralBlockPasskeyAppend;
    const alternatives = blockBody.alternatives ?? [];

    const fallbacks = alternatives
      .filter(a => a.block === BlockType.PhoneVerify || a.block === BlockType.EmailVerify)
      .map(alternative => {
        switch (alternative.block) {
          case BlockType.EmailVerify: {
            const typed = alternative.data as GeneralBlockVerifyIdentifier;
            if (typed.verificationMethod === VerificationMethod.EmailOtp) {
              return { label: 'Send email verification code', action: () => this.initFallbackEmailOtp() };
            }

            return { label: 'Send email verification link', action: () => this.initFallbackEmailLink() };
          }
          case BlockType.PhoneVerify:
            return { label: 'Send phone verification code', action: () => this.initFallbackSmsOtp() };
          default:
            throw new Error('Invalid block type');
        }
      });

    this.authType = blockBody.authType;
    this.data = {
      availableFallbacks: fallbacks,
      userHandle: data.userHandle,
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

  async initFallbackEmailLink(): Promise<void> {
    const newBlock = await this.app.authProcessService.startEmailLinkVerification();
    this.updateProcess(newBlock);

    return;
  }
}
