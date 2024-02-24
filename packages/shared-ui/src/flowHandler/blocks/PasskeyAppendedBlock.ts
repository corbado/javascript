import type { BlockBody, CorbadoApp } from '@corbado/web-core';
import type { AuthType } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataPasskeyAppended } from '../types';
import { Block } from './Block';

export class PasskeyAppendedBlock extends Block<BlockDataPasskeyAppended> {
  readonly data: BlockDataPasskeyAppended = {};
  readonly type = BlockTypes.PasskeyAppended;
  readonly initialScreen = ScreenNames.PasskeySuccess;
  readonly authType: AuthType;

  constructor(app: CorbadoApp, flowHandler: ProcessHandler, blockBody: BlockBody) {
    super(app, flowHandler);

    this.authType = blockBody.authType;
  }

  async continue() {
    const newBlock = await this.app.authProcessService.skipBlock();
    this.updateBlock(newBlock);

    return;
  }
}
