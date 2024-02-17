import type { CorbadoApp } from '@corbado/web-core';
import type { BlockBody } from '@corbado/web-core/dist/api/v2';

import type { BlockTypes, ScreenNames } from '../constants';
import type { FlowHandler } from '../flowHandler';

export abstract class Block<A> {
  abstract readonly data: A;
  abstract readonly type: BlockTypes;
  abstract readonly initialScreen: ScreenNames;

  protected readonly app: CorbadoApp;
  protected readonly flowHandler: FlowHandler;

  constructor(app: CorbadoApp, flowHandler: FlowHandler) {
    this.flowHandler = flowHandler;
    this.app = app;
  }

  protected updateScreen(newScreen: ScreenNames) {
    this.flowHandler.updateScreen(newScreen);

    return;
  }

  protected updateBlock(blockBody: BlockBody) {
    this.flowHandler.updateBlock(blockBody);

    return;
  }
}
