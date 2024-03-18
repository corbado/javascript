import type { BlockBody, CorbadoError, EmailVerifyFromUrl, ProcessCommon, ProcessResponse } from '@corbado/web-core';
import { BlockType, type CorbadoApp } from '@corbado/web-core';
import type { i18n } from 'i18next';
import type { Result } from 'ts-results';
import { Ok } from 'ts-results';

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
import { ContinueOnOtherEnvBlock } from './blocks/ContinueOnOtherEnvBlock';
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
  #abortController = new AbortController();

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
  async init(): Promise<Result<void, CorbadoError>> {
    const emailVerifyFromUrl = this.#corbadoApp.authProcessService.initEmailVerifyFromUrl();
    if (emailVerifyFromUrl.err) {
      await this.handleError(emailVerifyFromUrl.val);
      return Ok(void 0);
    }

    if (emailVerifyFromUrl.val) {
      this.handleProcessUpdateFromUrl(emailVerifyFromUrl.val);
      return Ok(void 0);
    }

    const res = await this.#corbadoApp.authProcessService.init(this.#abortController);
    if (res.err) {
      return res;
    }

    this.handleProcessUpdateBackend(res.val);

    return Ok(void 0);
  }

  dispose() {
    this.#corbadoApp.dispose();
    this.#abortController.abort();
  }

  get currentScreenName() {
    return this.#currentScreen;
  }

  updateScreen(newScreen: ScreenNames) {
    this.#currentScreen = newScreen;

    this.#onScreenChangeCallbacks.forEach(cb =>
      cb({
        screen: newScreen,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

  handleProcessUpdateFromUrl(emailVerifyFromUrl: EmailVerifyFromUrl) {
    const newBlock = EmailVerifyBlock.fromUrl(
      this.#corbadoApp,
      this,
      this.#errorTranslator,
      emailVerifyFromUrl.data,
      emailVerifyFromUrl.authType,
      emailVerifyFromUrl.isNewDevice,
      emailVerifyFromUrl.token,
    ) as Block<unknown>;

    newBlock.init();
    this.#updatePrimaryBlock(newBlock);
  }

  handleProcessUpdateBackend(processResponse: ProcessResponse, error?: CorbadoError) {
    const newPrimaryBlock = this.#parseBlockData(processResponse.blockBody, processResponse.common);

    if (error) {
      newPrimaryBlock.error = error;
    }

    const alternatives =
      processResponse.blockBody.alternatives?.map(b => this.#parseBlockData(b, processResponse.common)) ?? [];
    newPrimaryBlock.setAlternatives(alternatives);
    newPrimaryBlock.init();

    this.#updatePrimaryBlock(newPrimaryBlock);
  }

  handleProcessUpdateFrontend(newPrimaryBlock: Block<unknown>, newAlternatives: Block<unknown>[] = []) {
    newPrimaryBlock.setAlternatives(newAlternatives);

    this.#updatePrimaryBlock(newPrimaryBlock);
  }

  // @todo: make sure that this error is shown as a message on the first screen
  async handleError(corbadoError: CorbadoError) {
    console.log('handleError', corbadoError);
    // get a new process
    const res = await this.#corbadoApp.authProcessService.init(this.#abortController);
    if (res.err) {
      return res;
    }

    this.handleProcessUpdateBackend(res.val, corbadoError);

    return;
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        block: this.#currentBlock!,
      }),
    );
  };

  #parseBlockData = (blockBody: BlockBody, common: ProcessCommon) => {
    if (blockBody.continueOnOtherDevice) {
      return new ContinueOnOtherEnvBlock(
        this.#corbadoApp,
        this,
        common,
        this.#errorTranslator,
        blockBody.authType,
        blockBody.continueOnOtherDevice,
      );
    }

    let block: Block<unknown>;
    switch (blockBody.block) {
      case BlockType.PasskeyAppend:
        block = new PasskeyAppendBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody);
        break;
      case BlockType.SignupInit:
        block = new SignupInitBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody.data);
        break;
      case BlockType.LoginInit:
        block = new LoginInitBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody.data);
        break;
      case BlockType.PasskeyAppended:
        block = new PasskeyAppendedBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody);
        break;
      case BlockType.EmailVerify:
        block = EmailVerifyBlock.fromBackend(
          this.#corbadoApp,
          this,
          common,
          this.#errorTranslator,
          blockBody.data,
          blockBody.authType,
        );
        break;
      case BlockType.PhoneVerify:
        block = new PhoneVerifyBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody);
        break;
      case BlockType.Completed:
        block = new CompletedBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody);
        break;
      case BlockType.PasskeyVerify:
        block = new PasskeyVerifyBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody);
        break;
      default:
        throw new Error(`Invalid block type: ${blockBody.block}}`);
    }

    if (blockBody.error) {
      block.setError(blockBody.error);
    }

    return block;
  };
}