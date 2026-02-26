import type { AuthType, BlockBody, CorbadoApp, ProcessCommon } from '@corbado/web-core';
import type { GeneralBlockCompleted } from '@corbado/web-core/dist/api/v2';

import type { CorbadoTracker } from '@corbado/observe';
import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import { Block } from './Block';

export class CompletedBlock extends Block<GeneralBlockCompleted> {
  readonly data: GeneralBlockCompleted;
  readonly type = BlockTypes.Completed;
  readonly initialScreen = ScreenNames.End;
  readonly authType: AuthType;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    blockBody: BlockBody,
    observeTracker?: CorbadoTracker,
  ) {
    super(app, flowHandler, common, errorTranslator, observeTracker);

    this.authType = blockBody.authType;
    this.data = blockBody.data as GeneralBlockCompleted;
  }
}
