import type { CorbadoApp } from '@corbado/web-core';
import type { AuthenticationResponse } from '@corbado/web-core/dist/api/v2';

import { BlockTypes, ScreenNames } from '../constants';
import type { FlowHandler } from '../flowHandler';
import { Block } from './Block';

export class CompletedBlock extends Block<undefined> {
  readonly data: undefined;
  readonly type = BlockTypes.Completed;
  readonly initialScreen = ScreenNames.End;

  constructor(app: CorbadoApp, flowHandler: FlowHandler, data: AuthenticationResponse) {
    super(app, flowHandler);

    app.sessionService.setSession(data.shortSession, data.longSession);

    flowHandler.onProcessCompleted();
  }
}
