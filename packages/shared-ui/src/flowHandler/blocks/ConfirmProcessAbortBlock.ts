import type { CorbadoApp, ProcessCommon } from '@corbado/web-core';
import { AuthType } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import { Block } from './Block';

export class ConfirmProcessAbortBlock extends Block<Block<unknown>> {
  readonly data: Block<unknown>;
  readonly type = BlockTypes.ConfirmProcessAbort;
  readonly initialScreen = ScreenNames.ConfirmProcessAbort;
  readonly authType = AuthType.Signup;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    originalBlock: Block<unknown>,
  ) {
    super(app, flowHandler, common, errorTranslator);

    this.data = originalBlock;
  }
}
