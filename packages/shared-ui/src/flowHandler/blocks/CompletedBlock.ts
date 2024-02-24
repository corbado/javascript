import type { AuthType, BlockBody, CorbadoApp } from '@corbado/web-core';
import type { AuthenticationResponse } from '@corbado/web-core/dist/api/v2';

import { BlockTypes, ScreenNames } from '../constants';
import type { ProcessHandler } from '../processHandler';
import { Block } from './Block';

export class CompletedBlock extends Block<undefined> {
  readonly data: undefined;
  readonly type = BlockTypes.Completed;
  readonly initialScreen = ScreenNames.End;
  readonly authType: AuthType;

  constructor(app: CorbadoApp, flowHandler: ProcessHandler, blockBody: BlockBody) {
    super(app, flowHandler);

    this.authType = blockBody.authType;

    const data = blockBody.data as AuthenticationResponse;
    app.sessionService.setSession(data.shortSession, data.longSession);

    flowHandler.onProcessCompleted();
  }
}
