import type { AuthType, GeneralBlockPasskeyAppendAfterHybrid } from '@corbado/web-core';
import type { BlockBody, CorbadoApp, ProcessCommon } from '@corbado/web-core';

import { BlockTypes, ScreenNames, skipPasskeyAppendAfterHybridKey } from '../constants';
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

    this.authType = blockBody.authType;
    const data = blockBody.data as GeneralBlockPasskeyAppendAfterHybrid;

    this.data = {
      passkeyIconSet: data.passkeyIconSet,
    };
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

    if (this.#passkeyAborted) {
      return;
    }

    return this.updateProcess(res);
  }

  async skipPasskeyAppend(): Promise<void> {
    this.cancelPasskeyOperation();

    const newBlock = await this.app.authProcessService.skipBlock();
    this.updateProcess(newBlock);

    return;
  }

  skipBlockInFuture() {
    localStorage.setItem(skipPasskeyAppendAfterHybridKey, 'true');
  }
}
