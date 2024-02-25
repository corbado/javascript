import type { AuthType, CorbadoApp, ProcessCommon } from '@corbado/web-core';
import type { ProcessResponse } from '@corbado/web-core/dist/api/v2';

import type { BlockTypes, ScreenNames } from '../constants';
import type { ProcessHandler } from '../processHandler';

export abstract class Block<A> {
  abstract readonly data: A;
  abstract readonly type: BlockTypes;
  abstract readonly initialScreen: ScreenNames;
  abstract readonly authType: AuthType;

  protected readonly app: CorbadoApp;
  readonly flowHandler: ProcessHandler;
  readonly common: ProcessCommon;
  alternatives: Block<unknown>[] = [];

  constructor(app: CorbadoApp, flowHandler: ProcessHandler, common: ProcessCommon) {
    this.flowHandler = flowHandler;
    this.app = app;
    this.common = common;
  }

  protected updateScreen(newScreen: ScreenNames) {
    this.flowHandler.updateScreen(newScreen);

    return;
  }

  protected updateProcess(processUpdate: ProcessResponse) {
    this.flowHandler.handleProcessUpdateBackend(processUpdate);

    return;
  }

  protected updateProcessFrontend(newPrimaryBlock: Block<unknown>, newAlternatives: Block<unknown>[] = []) {
    this.flowHandler.handleProcessUpdateFrontend(newPrimaryBlock, newAlternatives);

    return;
  }

  setAlternatives(alternatives: Block<unknown>[]) {
    this.alternatives = alternatives;
  }

  init() {
    return;
  }
}
