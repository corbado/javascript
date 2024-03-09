import type { BlockBody, CorbadoApp, ProcessCommon } from '@corbado/web-core';
import type { AuthType } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataPasskeyAppended } from '../types';
import { Block } from './Block';

export class PasskeyAppendedBlock extends Block<BlockDataPasskeyAppended> {
  readonly data: BlockDataPasskeyAppended = {};
  readonly type = BlockTypes.PasskeyAppended;
  readonly initialScreen = ScreenNames.PasskeySuccess;
  readonly authType: AuthType;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    blockBody: BlockBody,
  ) {
    super(app, flowHandler, common, errorTranslator);

    this.authType = blockBody.authType;
  }

  async continue() {
    const newBlock = await this.app.authProcessService.skipBlock();
    this.updateProcess(newBlock);

    return;
  }
}
