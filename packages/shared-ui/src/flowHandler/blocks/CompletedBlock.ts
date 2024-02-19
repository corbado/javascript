import type { CorbadoApp } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { FlowHandler } from '../flowHandler';
import { Block } from './Block';

export class CompletedBlock extends Block<undefined> {
  readonly data: undefined;
  readonly type = BlockTypes.Completed;
  readonly initialScreen = ScreenNames.End;

  constructor(app: CorbadoApp, flowHandler: FlowHandler) {
    super(app, flowHandler);

    flowHandler.onProcessCompleted();
  }
}
