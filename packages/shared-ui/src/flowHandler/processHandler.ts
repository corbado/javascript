import type { BlockBody, ProcessCommon, ProcessResponse } from '@corbado/web-core';
import { BlockType, type CorbadoApp } from '@corbado/web-core';
import type { i18n } from 'i18next';

import type { Block } from './blocks';
import {
  EmailVerifyBlock,
  LoginInitBlock,
  PasskeyAppendBlock,
  PasskeyAppendedBlock,
  PasskeyVerifyBlock,
  PhoneVerifyBlock,
  SignupInitBlock,
} from './blocks';
import { CompletedBlock } from './blocks/CompletedBlock';
import type { ScreenNames } from './constants';
import { ErrorTranslator } from './errorTranslator';
import type { ScreenWithBlock } from './types';

/**
 * ProcessHandler is a class that manages the navigation flow of the application.
 * It keeps track of the current flow, the current screen, and the screen history.
 * It also provides methods for navigating to the next screen, navigating back, and changing the flow.
 */
export class ProcessHandler {
  #currentScreen!: ScreenNames;
  #currentBlock: Block<unknown> | null = null;

  #corbadoApp: CorbadoApp;
  #errorTranslator: ErrorTranslator;
  readonly onProcessCompleted: () => void;

  #onScreenChangeCallbacks: Array<(v: ScreenWithBlock) => void> = [];

  /**
   * The constructor initializes the ProcessHandler with a flow name, a project configuration, and a flow handler configuration.
   * It sets the current flow to the specified flow, the current screen to the InitSignup screen, and initializes the screen history as an empty array.
   */
  constructor(i18next: i18n, corbadoApp: CorbadoApp | undefined, onProcessCompleted: () => void) {
    if (!corbadoApp) {
      throw new Error('corbadoApp is undefined. This should not happen.');
    }

    const errorTranslator = new ErrorTranslator(i18next);
    this.#corbadoApp = corbadoApp;
    this.#errorTranslator = errorTranslator;
    this.onProcessCompleted = onProcessCompleted;
  }

  /**
   * Initializes the ProcessHandler.
   * Call this function after registering all callbacks.
   */
  async init() {
    const initialBlock = await this.#corbadoApp.authProcessService.init();
    this.handleProcessUpdateBackend(initialBlock);
  }

  dispose() {
    this.#corbadoApp.dispose();
  }

  get currentScreenName() {
    return this.#currentScreen;
  }

  updateScreen(newScreen: ScreenNames) {
    this.#currentScreen = newScreen;

    this.#onScreenChangeCallbacks.forEach(cb =>
      cb({
        screen: newScreen,
        block: this.#currentBlock!,
      }),
    );
  }

  onScreenChange(cb: (value: ScreenWithBlock) => void) {
    return this.#onScreenChangeCallbacks.push(cb) - 1;
  }

  removeOnScreenChangeCallback(cbId: number) {
    this.#onScreenChangeCallbacks.splice(cbId, 1);
  }

  handleProcessUpdateBackend(processUpdate: ProcessResponse) {
    const newPrimaryBlock = this.#parseBlockData(processUpdate.blockBody, processUpdate.common);
    const alternatives =
      processUpdate.blockBody.alternatives?.map(b => this.#parseBlockData(b, processUpdate.common)) ?? [];
    newPrimaryBlock.setAlternatives(alternatives);
    newPrimaryBlock.init();

    this.#updatePrimaryBlock(newPrimaryBlock);
  }

  handleProcessUpdateFrontend(newPrimaryBlock: Block<unknown>, newAlternatives: Block<unknown>[] = []) {
    newPrimaryBlock.setAlternatives(newAlternatives);

    this.#updatePrimaryBlock(newPrimaryBlock);
  }

  #updatePrimaryBlock = (newPrimaryBlock: Block<unknown>) => {
    const blockHasChanged = this.#currentBlock == null || newPrimaryBlock.type !== this.#currentBlock.type;
    if (blockHasChanged) {
      this.#currentScreen = newPrimaryBlock.initialScreen;
    }

    this.#currentBlock = newPrimaryBlock;
    this.#onScreenChangeCallbacks.forEach(cb =>
      cb({
        screen: this.#currentScreen,
        block: this.#currentBlock!,
      }),
    );
  };

  #parseBlockData = (blockBody: BlockBody, common: ProcessCommon) => {
    switch (blockBody.block) {
      case BlockType.PasskeyAppend:
        return new PasskeyAppendBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody);
      case BlockType.SignupInit:
        return new SignupInitBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody.data);
      case BlockType.LoginInit:
        return new LoginInitBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody.data);
      case BlockType.PasskeyAppended:
        return new PasskeyAppendedBlock(this.#corbadoApp, this, common, blockBody);
      case BlockType.EmailVerify:
        return new EmailVerifyBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody);
      case BlockType.PhoneVerify:
        return new PhoneVerifyBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody);
      case BlockType.Completed:
        return new CompletedBlock(this.#corbadoApp, this, common, blockBody);
      case BlockType.PasskeyVerify:
        return new PasskeyVerifyBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody);
      default:
        throw new Error(`Invalid block type: ${blockBody.block}}`);
    }
  };
}
