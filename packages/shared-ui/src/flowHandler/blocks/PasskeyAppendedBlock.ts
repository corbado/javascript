import type { CorbadoApp } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { FlowHandler } from '../flowHandler';
import type { BlockDataPasskeyAppended } from '../types';
import { Block } from './Block';

export class PasskeyAppendedBlock extends Block<BlockDataPasskeyAppended> {
  readonly data: BlockDataPasskeyAppended = {};
  readonly type = BlockTypes.PasskeyAppended;
  readonly initialScreen = ScreenNames.PasskeySuccess;

  constructor(app: CorbadoApp, flowHandler: FlowHandler) {
    super(app, flowHandler);
  }

  async continue() {
    const newBlock = await this.app.authProcessService.skipBlock();
    this.flowHandler.updateBlock(newBlock);

    return;
  }
}
