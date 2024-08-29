import type { BlockBody, CorbadoApp, GeneralBlockPasskeyAppend, ProcessCommon } from '@corbado/web-core';
import {
  AuthType,
  BlockType,
  ExcludeCredentialsMatchError,
  GeneralBlockPasskeyAppendVariantEnum,
  VerificationMethod,
} from '@corbado/web-core';

import { BlockTypes, createLoginIdentifierType, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataEmailVerify, BlockDataPasskeyAppend, PasskeyFallback } from '../types';
import { Block } from './Block';

export class PasskeyAppendBlock extends Block<BlockDataPasskeyAppend> {
  readonly data: BlockDataPasskeyAppend;
  readonly type = BlockTypes.PasskeyAppend;
  readonly initialScreen: ScreenNames = ScreenNames.PasskeyAppend;
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
    const alternatives = blockBody.alternatives ?? [];

    // if there is a completed alternative, the passkey-append block can be skipped and the user can log in immediately
    const canBeSkipped = alternatives.some(a => a.block === BlockType.Completed);

    this.authType = blockBody.authType;
    const userHandleType = createLoginIdentifierType(data.identifierType);

    if (this.authType === AuthType.Login) {
      app.authProcessService.dropPasskeyAppendShown();
    }

    switch (data.variant) {
      case GeneralBlockPasskeyAppendVariantEnum.Default:
        this.initialScreen = ScreenNames.PasskeyAppend;
        break;
      case GeneralBlockPasskeyAppendVariantEnum.AfterHybrid:
        this.initialScreen = ScreenNames.PasskeyAppendAfterHybrid;
        break;
      case GeneralBlockPasskeyAppendVariantEnum.AfterError:
        this.initialScreen = ScreenNames.PasskeyAppendAfterError;
        break;
    }

    this.data = {
      availableFallbacks: [],
      userHandle: data.identifierValue,
      userHandleType,
      canBeSkipped,
      autoSubmit: data.autoSubmit,
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

  getFormattedPhoneNumber = () => Block.getFormattedPhoneNumber(this.data.userHandle);

  showEditUserData() {
    this.cancelPasskeyOperation();
    this.updateScreen(ScreenNames.EditUserData);
  }

  showPasskeyAppend() {
    this.updateScreen(ScreenNames.PasskeyAppend);
  }

  async passkeyAppend() {
    this.#passkeyAborted = false;

    const res = await this.app.authProcessService.appendPasskey();
    if (res.err) {
      // This check is necessary because the user might have navigated away from the passkey block before the operation was completed
      if (this.#passkeyAborted) {
        return;
      }

      if (res.val instanceof ExcludeCredentialsMatchError) {
        await this.app.authProcessService.recordEventAppendCredentialExistsError();
        const newBlock = await this.app.authProcessService.finishAuthProcess();
        this.updateProcess(newBlock);
        return;
      }

      await this.app.authProcessService.recordEventAppendError();
      this.updateScreen(ScreenNames.PasskeyError);
      return;
    }

    this.updateProcess(res);

    return;
  }

  async initFallbackEmailOtp(): Promise<void> {
    await this.app.authProcessService.recordEventAppendExplicitAbort();
    this.cancelPasskeyOperation();

    const newBlock = await this.app.authProcessService.startEmailCodeVerification();
    this.updateProcess(newBlock);

    return;
  }

  async initFallbackSmsOtp(): Promise<void> {
    await this.app.authProcessService.recordEventAppendExplicitAbort();
    this.cancelPasskeyOperation();

    const newBlock = await this.app.authProcessService.startPhoneOtpVerification();
    this.updateProcess(newBlock);

    return;
  }

  async initFallbackEmailLink(): Promise<void> {
    await this.app.authProcessService.recordEventAppendExplicitAbort();
    this.cancelPasskeyOperation();

    const newBlock = await this.app.authProcessService.startEmailLinkVerification();
    this.updateProcess(newBlock);

    return;
  }

  async skipPasskeyAppend(): Promise<void> {
    await this.app.authProcessService.recordEventAppendExplicitAbort();
    this.cancelPasskeyOperation();

    const newBlock = await this.app.authProcessService.finishAuthProcess();
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

  async updateUsername(value: string): Promise<string | undefined> {
    const newBlock = await this.app.authProcessService.updateUsername(value);

    if (newBlock.err) {
      this.updateProcess(newBlock);
      return;
    }

    const error = newBlock.val.blockBody.error;

    //If the new username is invalid, we don't want to update the block because the new block data from BE has no indicator for ScreenNames.EditUserInfo
    //So, the FE needs to maintain state and we just  want to show the translated error message
    if (error) {
      return this.errorTranslator.translateWithIdentifier(error, 'username');
    }

    this.updateProcess(newBlock);
    this.showPasskeyAppend();

    return;
  }

  async skipFutureAppendAfterHybrid(): Promise<void> {
    await this.app.authProcessService.recordEventUserAppendAfterCrossPlatformBlacklisted();
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
