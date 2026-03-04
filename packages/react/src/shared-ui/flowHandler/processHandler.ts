import type { CorbadoTracker, LoginMethodType } from '@corbado/observe';
import type {
  BlockBody,
  CorbadoError,
  EmailVerifyFromUrl,
  GeneralBlockVerifyIdentifier,
  ProcessCommon,
  ProcessResponse,
} from '@corbado/web-core';
import { AuthType, BlockType, type CorbadoApp } from '@corbado/web-core';
import type { GeneralBlockCompleted } from '@corbado/web-core/dist/api/v2';
import type { i18n } from 'i18next';
import type { Result } from 'ts-results';
import { Ok } from 'ts-results';

import type { Block } from './blocks';
import {
  ContinueOnOtherEnvBlock,
  EmailVerifyBlock,
  LoginInitBlock,
  PasskeyAppendBlock,
  PasskeyAppendedBlock,
  PasskeyVerifyBlock,
  PhoneVerifyBlock,
  SignupInitBlock,
} from './blocks';
import { CompletedBlock } from './blocks/CompletedBlock';
import type { BlockTypes } from './constants';
import { initScreenBlocks, ScreenNames } from './constants';
import { ErrorTranslator } from './errorTranslator';
import { ProcessHistoryHandler } from './processHistoryHandler';
import type { ScreenWithBlock } from './types';

/**
 * ProcessHandler is a class that manages the navigation flow of the application.
 * It keeps track of the current flow, the current screen, and the screen history.
 * It also provides methods for navigating to the next screen, navigating back, and changing the flow.
 */
export class ProcessHandler {
  static #extractUserIdFromJwt(jwt?: string): string | undefined {
    if (!jwt) {
      return undefined;
    }

    try {
      const payload = jwt.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

      return decoded.sub;
    } catch {
      return undefined;
    }
  }

  static #blockToMethod(block: Block<unknown>): LoginMethodType | undefined {
    if (block instanceof PasskeyVerifyBlock) {
      return 'passkey';
    }

    if (block instanceof EmailVerifyBlock) {
      return block.data.verificationMethod === 'email-link' ? 'email-link' : 'email-otp';
    }

    if (block instanceof PhoneVerifyBlock) {
      return 'phone-otp';
    }

    return undefined;
  }

  #currentScreen!: ScreenNames;
  #currentBlock: Block<unknown> | null = null;
  #abortController = new AbortController();

  #corbadoApp: CorbadoApp;
  #processHistoryHandler: ProcessHistoryHandler;
  #errorTranslator: ErrorTranslator;
  #postProcess: () => void;
  #observeTracker: CorbadoTracker | undefined;
  #signupVisibleFired = false;

  #onScreenChangeCallbacks: Array<(v: ScreenWithBlock) => void> = [];

  /**
   * The constructor initializes the ProcessHandler with a flow name, a project configuration, and a flow handler configuration.
   * It sets the current flow to the specified flow, the current screen to the InitSignup screen, and initializes the screen history as an empty array.
   */
  constructor(
    i18next: i18n,
    corbadoApp: CorbadoApp | undefined,
    postProcess: () => void,
    handleNavigationEvents = true,
    observeTracker?: CorbadoTracker,
  ) {
    if (!corbadoApp) {
      throw new Error('corbadoApp is undefined. This should not happen.');
    }

    const errorTranslator = new ErrorTranslator(i18next);
    this.#corbadoApp = corbadoApp;
    this.#processHistoryHandler = new ProcessHistoryHandler(handleNavigationEvents);
    this.#errorTranslator = errorTranslator;
    this.#postProcess = postProcess;
    this.#observeTracker = observeTracker;
  }

  /**
   * Initializes the ProcessHandler.
   * Call this function after registering all callbacks.
   */
  async init(initialBlockFromComponentConfig?: BlockTypes): Promise<Result<void, CorbadoError>> {
    const frontendPreferredBlockType = this.#processHistoryHandler.init(
      (blockType: BlockTypes) => this.switchToBlock(blockType),
      () => this.startAskForAbort(),
    );

    const emailVerifyFromUrl = this.#corbadoApp.authProcessService.initEmailVerifyFromUrl();
    if (emailVerifyFromUrl.err) {
      this.handleError(emailVerifyFromUrl.val);
      return Ok(void 0);
    }

    if (emailVerifyFromUrl.val) {
      this.handleProcessUpdateFromUrl(emailVerifyFromUrl.val);
      return Ok(void 0);
    }

    // we prefer frontendPreferredBlockType over initialBlockFromComponentConfig
    const res = await this.#corbadoApp.authProcessService.init(
      this.#abortController,
      (frontendPreferredBlockType ?? initialBlockFromComponentConfig) as BlockType,
    );

    if (res.err) {
      return res;
    }

    this.handleProcessUpdateBackend(res.val);

    return Ok(void 0);
  }

  onProcessCompleted(data: GeneralBlockCompleted) {
    const userId = ProcessHandler.#extractUserIdFromJwt(data.sessionToken);

    if (this.#currentBlock?.authType === AuthType.Login) {
      this.#observeTracker?.loginFinish({ userId });
    } else if (this.#currentBlock?.authType === AuthType.Signup) {
      this.#observeTracker?.signupFinish({ userId });
    }

    this.#corbadoApp.authProcessService.clearProcess();
    this.#corbadoApp.authProcessService.dropLastIdentifier(data.passkeyOperation);
    this.#currentBlock = null;
    this.#corbadoApp.sessionService.setSession(data.sessionToken, data.refreshToken);

    this.#postProcess();
  }

  switchToBlock(blockType: BlockTypes): boolean {
    if (this.#currentBlock?.type === blockType) {
      this.handleProcessUpdateFrontend(this.#currentBlock, this.#currentBlock.alternatives);

      return true;
    }

    const newBlock = this.#currentBlock?.alternatives.find(b => b.type === blockType);
    if (!newBlock) {
      return false;
    }

    const newAlternatives = this.#currentBlock?.alternatives.filter(b => b.type !== blockType) ?? [];
    if (this.#currentBlock) {
      newAlternatives.push(this.#currentBlock);
    }

    this.handleProcessUpdateFrontend(newBlock, newAlternatives);

    return true;
  }

  // this adds a ConfirmProcessAbortBlock to the process
  startAskForAbort() {
    const currentBlock = this.#currentBlock;
    if (!currentBlock || initScreenBlocks.includes(currentBlock.type)) {
      return;
    }

    // in login processes we don't want to ask for abort (we auto-confirm it)
    if (currentBlock.authType === AuthType.Login) {
      void currentBlock.confirmAbort();
      return;
    }

    // The default action is to continue on yes and abort on no because mobile Safari will auto-cancel.
    // For reference see (unsolved bug): https://stackoverflow.com/questions/38083702/alert-confirm-and-prompt-not-working-after-using-history-api-on-safari-ios
    if (
      confirm(
        'Going back will restart the signup process and your current progress will be lost. Do you wish to complete the current signup first?',
      )
    ) {
      history.forward();
    } else {
      void currentBlock.confirmAbort();
    }
  }

  dispose() {
    this.#corbadoApp.dispose();
    this.#abortController.abort();
    this.#processHistoryHandler.dispose();
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
      emailVerifyFromUrl.token,
      this.#observeTracker,
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
    newPrimaryBlock.init();

    this.#updatePrimaryBlock(newPrimaryBlock);
  }

  // updates the current block with the error and updates the screen
  handleError(corbadoError: CorbadoError) {
    console.log('handleError', corbadoError.name, corbadoError.message);

    const primaryBlockWithError = this.#currentBlock;
    if (!primaryBlockWithError) {
      return;
    }

    primaryBlockWithError.error = corbadoError;
    this.#updatePrimaryBlock(primaryBlockWithError);

    return;
  }

  #updatePrimaryBlock = (newPrimaryBlock: Block<unknown>) => {
    if (newPrimaryBlock instanceof CompletedBlock) {
      if (newPrimaryBlock.error) {
        this.#currentBlock = newPrimaryBlock;
        this.#currentScreen = ScreenNames.CompletedError;

        this.#onScreenChangeCallbacks.forEach(cb =>
          cb({
            screen: this.#currentScreen,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            block: this.#currentBlock!,
          }),
        );

        return;
      }

      this.onProcessCompleted(newPrimaryBlock.data);

      return;
    }

    const blockHasChanged = this.#currentBlock == null || newPrimaryBlock.type !== this.#currentBlock.type;
    if (blockHasChanged) {
      this.#currentScreen = newPrimaryBlock.initialScreen;

      if (newPrimaryBlock instanceof SignupInitBlock) {
        if (!this.#signupVisibleFired) {
          this.#signupVisibleFired = true;
          this.#observeTracker?.signupVisible({});
        }
      }

      if (newPrimaryBlock instanceof EmailVerifyBlock) {
        newPrimaryBlock.activateTracking();
        this.#firePostIdentifierDecision(newPrimaryBlock);
      }

      if (newPrimaryBlock instanceof PasskeyVerifyBlock) {
        this.#firePostIdentifierDecision(newPrimaryBlock);
      }

      if (newPrimaryBlock instanceof PhoneVerifyBlock) {
        this.#firePostIdentifierDecision(newPrimaryBlock);
      }
    } else if (newPrimaryBlock instanceof EmailVerifyBlock) {
      newPrimaryBlock.activateTracking();
    }

    this.#currentBlock = newPrimaryBlock;

    this.#onScreenChangeCallbacks.forEach(cb =>
      cb({
        screen: this.#currentScreen,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        block: this.#currentBlock!,
      }),
    );

    if (blockHasChanged) {
      this.#processHistoryHandler.registerBlockChange(newPrimaryBlock.type);
    }
  };

  #firePostIdentifierDecision = (block: Block<unknown>) => {
    if (!this.#observeTracker) {
      return;
    }

    const methods: LoginMethodType[] = [];

    const primaryMethod = ProcessHandler.#blockToMethod(block);
    if (primaryMethod) {
      methods.push(primaryMethod);
    }

    for (const alt of block.alternatives) {
      const altMethod = ProcessHandler.#blockToMethod(alt);
      if (altMethod) {
        methods.push(altMethod);
      }
    }

    methods.push('reset-flow');

    this.#observeTracker.loginMethodsDecisionOffered({
      decisionName: 'post-identifier',
      availableMethods: methods,
    });
  };

  #parseBlockData = (blockBody: BlockBody, common: ProcessCommon) => {
    const t = this.#observeTracker;

    if (blockBody.continueOnOtherDevice) {
      return new ContinueOnOtherEnvBlock(
        this.#corbadoApp,
        this,
        common,
        this.#errorTranslator,
        blockBody.authType,
        blockBody.continueOnOtherDevice,
        t,
      );
    }

    let block: Block<unknown>;
    switch (blockBody.block) {
      case BlockType.PasskeyAppend:
        block = new PasskeyAppendBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody, t);
        break;
      case BlockType.SignupInit:
        block = new SignupInitBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody, t);
        break;
      case BlockType.LoginInit:
        block = new LoginInitBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody, t);
        break;
      case BlockType.PasskeyAppended:
        block = new PasskeyAppendedBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody, t);
        break;
      case BlockType.PostSignupEmailVerify:
      case BlockType.EmailVerify:
        block = EmailVerifyBlock.fromBackend(
          this.#corbadoApp,
          this,
          common,
          this.#errorTranslator,
          blockBody.data as GeneralBlockVerifyIdentifier,
          blockBody.authType,
          t,
        );
        break;
      case BlockType.PhoneVerify:
        block = new PhoneVerifyBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody, t);
        break;
      case BlockType.Completed:
        block = new CompletedBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody, t);
        break;
      case BlockType.PasskeyVerify:
        block = new PasskeyVerifyBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody, t);
        break;
      //TODO: Add MissingFieldsBlock
      // case BlockType.MissingFields:
      // block = new MissingFieldsBlock(this.#corbadoApp, this, common, this.#errorTranslator, blockBody);
      // break;
      default:
        throw new Error(`Invalid block type: ${blockBody.block}}`);
    }

    if (blockBody.error) {
      block.setError(blockBody.error);
    }

    return block;
  };
}
