import type {
  AuthType,
  BlockBody,
  CorbadoApp,
  GeneralBlockPasskeyAppendAfterHybrid,
  ProcessCommon,
} from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataPasskeyAppendAfterHybrid } from '../types';
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
    const data = blockBody.data as GeneralBlockPasskeyAppendAfterHybrid;

    this.authType = blockBody.authType;

    this.data = {
      passkeyIconSet: data.passkeyIconSet,
    };
  }

  showPasskeyAppend() {
    this.updateScreen(ScreenNames.PasskeyAppend);
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

  async skipPasskeyAppend(): Promise<void> {
    this.cancelPasskeyOperation();

    const newBlock = await this.app.authProcessService.finishAuthProcess();
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