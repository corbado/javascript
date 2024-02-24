import type { BlockBody } from '@corbado/web-core';
import { BlockType, type CorbadoApp } from '@corbado/web-core';
import type { i18n } from 'i18next';

import type { Block } from './blocks';
import { LoginInitBlock } from './blocks';
import { EmailVerifyBlock, PasskeyAppendBlock, PasskeyAppendedBlock, SignupInitBlock } from './blocks';
import { CompletedBlock } from './blocks/CompletedBlock';
import { PhoneVerifyBlock } from './blocks/PhoneVerifyBlock';
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
    this.handleBlockUpdateBackend(initialBlock);
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

  handleBlockUpdateBackend(blockBody: BlockBody) {
    const newPrimaryBlock = this.#parseBlockData(blockBody);
    const alternatives = blockBody.alternatives?.map(this.#parseBlockData) ?? [];
    newPrimaryBlock.setAlternatives(alternatives);

    this.#updatePrimaryBlock(newPrimaryBlock);
  }

  handleBlockUpdateFrontend(newPrimaryBlock: Block<unknown>, newAlternatives: Block<unknown>[] = []) {
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

  #parseBlockData = (blockBody: BlockBody) => {
    switch (blockBody.block) {
      case BlockType.PasskeyAppend:
        return new PasskeyAppendBlock(this.#corbadoApp, this, this.#errorTranslator, blockBody);
      case BlockType.SignupInit:
        return new SignupInitBlock(this.#corbadoApp, this, this.#errorTranslator, blockBody.data);
      case BlockType.LoginInit:
        return new LoginInitBlock(this.#corbadoApp, this, this.#errorTranslator, blockBody.data);
      case BlockType.PasskeyAppended:
        return new PasskeyAppendedBlock(this.#corbadoApp, this, blockBody);
      case BlockType.EmailVerify:
        return new EmailVerifyBlock(this.#corbadoApp, this, this.#errorTranslator, blockBody);
      case BlockType.PhoneVerify:
        return new PhoneVerifyBlock(this.#corbadoApp, this, this.#errorTranslator, blockBody);
      case BlockType.Completed:
        return new CompletedBlock(this.#corbadoApp, this, blockBody);
      default:
        throw new Error(`Invalid block type: ${blockBody.block}}`);
    }
  };
}
