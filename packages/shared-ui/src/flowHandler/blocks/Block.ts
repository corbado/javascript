import type { AuthType, CorbadoApp } from '@corbado/web-core';
import type { BlockBody } from '@corbado/web-core/dist/api/v2';

import type { BlockTypes, ScreenNames } from '../constants';
import type { ProcessHandler } from '../processHandler';

export abstract class Block<A> {
  abstract readonly data: A;
  abstract readonly type: BlockTypes;
  abstract readonly initialScreen: ScreenNames;
  abstract readonly authType: AuthType;

  protected readonly app: CorbadoApp;
  readonly #flowHandler: ProcessHandler;
  alternatives: Block<unknown>[] = [];

  constructor(app: CorbadoApp, flowHandler: ProcessHandler) {
    this.#flowHandler = flowHandler;
    this.app = app;
  }

  protected updateScreen(newScreen: ScreenNames) {
    this.#flowHandler.updateScreen(newScreen);

    return;
  }

  protected updateBlock(blockBody: BlockBody) {
    this.#flowHandler.handleBlockUpdateBackend(blockBody);

    return;
  }

  protected updateBlockFrontend(newPrimaryBlock: Block<unknown>, newAlternatives: Block<unknown>[] = []) {
    this.#flowHandler.handleBlockUpdateFrontend(newPrimaryBlock, newAlternatives);

    return;
  }

  setAlternatives(alternatives: Block<unknown>[]) {
    this.alternatives = alternatives;
  }
}
