import type { AuthType, CorbadoApp, ProcessCommon } from '@corbado/web-core';
import { CorbadoError } from '@corbado/web-core';
import type { ProcessResponse, RequestError } from '@corbado/web-core/dist/api/v2';
import type { Result } from 'ts-results';

import type { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';

export abstract class Block<A> {
  abstract readonly data: A;
  abstract readonly type: BlockTypes;
  abstract readonly initialScreen: ScreenNames;
  abstract readonly authType: AuthType;

  protected readonly app: CorbadoApp;
  readonly flowHandler: ProcessHandler;
  readonly errorTranslator: ErrorTranslator;
  readonly common: ProcessCommon;
  alternatives: Block<unknown>[] = [];
  error?: CorbadoError;

  constructor(app: CorbadoApp, flowHandler: ProcessHandler, common: ProcessCommon, errorTranslator: ErrorTranslator) {
    this.flowHandler = flowHandler;
    this.app = app;
    this.common = common;
    this.errorTranslator = errorTranslator;
  }

  protected updateScreen(newScreen: ScreenNames) {
    this.flowHandler.updateScreen(newScreen);

    return;
  }

  protected updateProcess(processUpdateRes: Result<ProcessResponse, CorbadoError>) {
    if (processUpdateRes.err && processUpdateRes.val.ignore) {
      return;
    }

    if (processUpdateRes.err) {
      void this.flowHandler.handleError(processUpdateRes.val);
      return;
    }

    this.flowHandler.handleProcessUpdateBackend(processUpdateRes.val);
    return;
  }

  protected updateProcessFrontend(newPrimaryBlock: Block<unknown>, newAlternatives: Block<unknown>[] = []) {
    this.flowHandler.handleProcessUpdateFrontend(newPrimaryBlock, newAlternatives);

    return;
  }

  setAlternatives(alternatives: Block<unknown>[]) {
    this.alternatives = alternatives;
  }

  setError(error: RequestError) {
    const corbadoError = new CorbadoError(true, false);
    const maybeTranslation = this.errorTranslator.translate(error);
    if (maybeTranslation) {
      corbadoError.translatedMessage = maybeTranslation;
    } else {
      corbadoError.message = error.message;
    }

    this.error = corbadoError;
  }

  init() {
    return;
  }

  async confirmAbort(): Promise<void> {
    const newBlock = await this.app.authProcessService.resetAuthProcess();
    this.updateProcess(newBlock);

    return;
  }

  cancelAbort(originalBlock: Block<unknown>) {
    this.updateProcessFrontend(originalBlock, originalBlock.alternatives);

    return;
  }
}
