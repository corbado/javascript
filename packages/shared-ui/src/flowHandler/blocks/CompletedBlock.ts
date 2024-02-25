import type { AuthType, BlockBody, CorbadoApp, ProcessCommon } from '@corbado/web-core';
import type { AuthenticationResponse } from '@corbado/web-core/dist/api/v2';

import { BlockTypes, ScreenNames } from '../constants';
import type { ProcessHandler } from '../processHandler';
import { Block } from './Block';

export class CompletedBlock extends Block<AuthenticationResponse> {
  readonly data: AuthenticationResponse;
  readonly type = BlockTypes.Completed;
  readonly initialScreen = ScreenNames.End;
  readonly authType: AuthType;

  constructor(app: CorbadoApp, flowHandler: ProcessHandler, common: ProcessCommon, blockBody: BlockBody) {
    super(app, flowHandler, common);

    this.authType = blockBody.authType;

    this.data = blockBody.data as AuthenticationResponse;
  }

  init() {
    this.app.sessionService.setSession(this.data.shortSession, this.data.longSession);
    this.flowHandler.onProcessCompleted();
  }
}
