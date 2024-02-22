import type { BlockBody } from '@corbado/web-core';
import { BlockType, type CorbadoApp } from '@corbado/web-core';
import type { i18n } from 'i18next';

import type { Block } from './blocks';
import { EmailVerifyBlock, PasskeyAppendBlock, PasskeyAppendedBlock, SignupInitBlock } from './blocks';
import { CompletedBlock } from './blocks/CompletedBlock';
import { PhoneVerifyBlock } from './blocks/PhoneVerifyBlock';
import type { ScreenNames } from './constants';
import { ErrorTranslator } from './errorTranslator';
import type { ScreenWithBlock } from './types';

/**
 * FlowHandler is a class that manages the navigation flow of the application.
 * It keeps track of the current flow, the current screen, and the screen history.
 * It also provides methods for navigating to the next screen, navigating back, and changing the flow.
 */
export class FlowHandler {
  #currentScreen!: ScreenNames;
  #currentBlock: Block<unknown> | null = null;

  #corbadoApp: CorbadoApp;
  #errorTranslator: ErrorTranslator;
  readonly onProcessCompleted: () => void;

  #onScreenChangeCallbacks: Array<(v: ScreenWithBlock) => void> = [];

  /**
   * The constructor initializes the FlowHandler with a flow name, a project configuration, and a flow handler configuration.
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
   * Initializes the FlowHandler.
   * Call this function after registering all callbacks.
   */
  async init() {
    const initialBlock = await this.#corbadoApp.authProcessService.init();
    this.handleBlockData(initialBlock);
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

  updateBlock(blockBody: BlockBody) {
    this.handleBlockData(blockBody);
  }

  onScreenChange(cb: (value: ScreenWithBlock) => void) {
    return this.#onScreenChangeCallbacks.push(cb) - 1;
  }

  removeOnScreenChangeCallback(cbId: number) {
    this.#onScreenChangeCallbacks.splice(cbId, 1);
  }

  handleBlockData(blockBody: BlockBody) {
    let newBlock: Block<unknown>;
    switch (blockBody.block) {
      case BlockType.PasskeyAppend:
        newBlock = new PasskeyAppendBlock(
          this.#corbadoApp,
          this,
          this.#errorTranslator,
          blockBody.data,
          blockBody.alternatives ?? [],
        );
        break;
      case BlockType.SignupInit:
        newBlock = new SignupInitBlock(this.#corbadoApp, this, this.#errorTranslator, blockBody.data);
        break;
      case BlockType.PasskeyAppended:
        newBlock = new PasskeyAppendedBlock(this.#corbadoApp, this);
        break;
      case BlockType.EmailVerify:
        newBlock = new EmailVerifyBlock(this.#corbadoApp, this, this.#errorTranslator, blockBody.data);
        break;
      case BlockType.PhoneVerify:
        newBlock = new PhoneVerifyBlock(this.#corbadoApp, this, this.#errorTranslator, blockBody.data);
        break;
      case BlockType.Completed:
        // this block is handled differently because it marks the end of the process
        newBlock = new CompletedBlock(this.#corbadoApp, this, blockBody.data);
        return;
      default:
        throw new Error(`Invalid block type: ${blockBody.block}}`);
    }

    const blockHasChanged = this.#currentBlock == null || newBlock.type !== this.#currentBlock.type;
    console.log('newBlock', newBlock, blockBody);
    console.log('currentBlock', this.#currentBlock, blockHasChanged);
    if (blockHasChanged) {
      this.#currentScreen = newBlock.initialScreen;
    }

    this.#currentBlock = newBlock;

    console.log('screen', this.#currentScreen);

    this.#onScreenChangeCallbacks.forEach(cb =>
      cb({
        screen: this.#currentScreen,
        block: this.#currentBlock!,
      }),
    );
  }
}
