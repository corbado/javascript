import { type CorbadoApp } from '@corbado/web-core';
import type { BlockBody } from '@corbado/web-core/dist/api/v2';
import type { i18n } from 'i18next';

import type { Block } from './blocks/Block';
import { SignupInitBlock } from './blocks/SignupInitBlock';
import type { ScreenNames } from './constants';
import { ErrorTranslator } from './errorTranslator';

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

  #onScreenChangeCallbacks: Array<(v: ScreenNames) => void> = [];
  #onBlockChangeCallbacks: Array<(v: Block<unknown>) => void> = [];

  /**
   * The constructor initializes the FlowHandler with a flow name, a project configuration, and a flow handler configuration.
   * It sets the current flow to the specified flow, the current screen to the InitSignup screen, and initializes the screen history as an empty array.
   */
  constructor(i18next: i18n, corbadoApp: CorbadoApp | undefined) {
    if (!corbadoApp) {
      throw new Error('corbadoApp is undefined. This should not happen.');
    }

    const errorTranslator = new ErrorTranslator(i18next);
    this.#corbadoApp = corbadoApp;
    this.#errorTranslator = errorTranslator;
  }

  /**
   * Initializes the FlowHandler.
   * Call this function after registering all callbacks.
   */
  async init(_: () => void) {
    // get sID for flow type

    // init flowHandler state

    /*
    let flowType = initialFlowType;

    const projectConfigResult = await this.#corbadoApp.projectService.getProjectConfig();
    if (projectConfigResult.err) {
      // currently there are no errors that can be thrown here
      return;
    }

    const projectConfig = projectConfigResult.val;
    if (!projectConfig.allowUserRegistration) {
      if (initialFlowType === FlowType.SignUp) {
        this.#corbadoApp.globalErrors.next(NonRecoverableError.userRegistrationNotAllowed());
      } else {
        flowType = FlowType.Login;
      }
    }
    */

    const initialBlock = await this.#corbadoApp.authProcessService.init(false);
    console.log('initialBlock', initialBlock);
    this.handleBlockData(initialBlock);

    // this.#changeFlow();
  }

  dispose() {
    this.#corbadoApp.dispose();
  }

  get currentScreenName() {
    return this.#currentScreen;
  }

  updateScreen(newScreen: ScreenNames) {
    this.#currentScreen = newScreen;

    this.#onScreenChangeCallbacks.forEach(cb => cb(newScreen));
  }

  updateBlock(blockBody: BlockBody) {
    this.handleBlockData(blockBody);
  }

  onScreenChange(cb: (value: ScreenNames) => void) {
    return this.#onScreenChangeCallbacks.push(cb) - 1;
  }

  removeOnScreenChangeCallback(cbId: number) {
    this.#onScreenChangeCallbacks.splice(cbId, 1);
  }

  onBlockChange(cb: (v: Block<any>) => void) {
    return this.#onBlockChangeCallbacks.push(cb) - 1;
  }

  removeOnBlockChange(cbId: number) {
    this.#onBlockChangeCallbacks.splice(cbId, 1);
  }

  handleBlockData(blockBody: BlockBody) {
    let newBlock: Block<any> = new SignupInitBlock(this.#corbadoApp, this, this.#errorTranslator, blockBody.data);
    switch (blockBody.block) {
      case 'passkey-append':
        break;
      case 'phone-verify':
        break;
      case 'signup-init':
        newBlock = new SignupInitBlock(this.#corbadoApp, this, this.#errorTranslator, blockBody.data);
        break;
      case 'passkey-appended':
        break;
      case 'social-verify':
        break;
      case 'completed':
        break;
      case 'email-verify':
        break;
      case 'phone-collect':
        break;
      case 'username-collect':
        break;
    }

    if (this.#currentBlock == null || newBlock.type !== this.#currentBlock.type) {
      this.updateScreen(newBlock.initialScreen);
    }

    this.#currentBlock = newBlock;
    this.#onBlockChangeCallbacks.forEach(cb => cb(newBlock));
  }
}
