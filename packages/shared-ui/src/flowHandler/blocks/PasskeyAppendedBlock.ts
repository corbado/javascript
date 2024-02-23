import type { CorbadoApp } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataPasskeyAppended } from '../types';
import { Block } from './Block';

export class PasskeyAppendedBlock extends Block<BlockDataPasskeyAppended> {
  readonly data: BlockDataPasskeyAppended = {};
  readonly type = BlockTypes.PasskeyAppended;
  readonly initialScreen = ScreenNames.PasskeySuccess;

  constructor(app: CorbadoApp, flowHandler: ProcessHandler) {
    super(app, flowHandler);
  }

  async continue() {
    const newBlock = await this.app.authProcessService.skipBlock();
    this.flowHandler.updateBlock(newBlock);

    return;
  }
}
