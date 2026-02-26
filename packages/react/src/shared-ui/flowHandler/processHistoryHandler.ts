import { BlockTypes } from './constants';

export class ProcessHistoryHandler {
  #handleNavigationEvents: boolean;
  #abortController: AbortController;

  constructor(handleNavigationEvents: boolean) {
    this.#handleNavigationEvents = handleNavigationEvents;
    this.#abortController = new AbortController();
  }

  init(maybeSwitchToBlock: (blockType: BlockTypes) => boolean, askForAbort: () => void): BlockTypes | null {
    if (!this.#handleNavigationEvents) {
      return null;
    }

    window.addEventListener(
      'hashchange',
      () => {
        const blockNameFromHash = this.#getCurrentLocationHash();

        const blockType = blockNameFromHash as BlockTypes;

        const switchWasPossible = maybeSwitchToBlock(blockType);

        if (!switchWasPossible) {
          askForAbort();
          return;
        }
      },
      { signal: this.#abortController.signal },
    );

    const currentLocationHash = this.#getCurrentLocationHash();
    if (currentLocationHash) {
      // we define those two overrides because they are more intuitive than the hash values
      if (currentLocationHash === 'register') {
        return BlockTypes.SignupInit;
      }

      if (currentLocationHash === 'login') {
        return BlockTypes.LoginInit;
      }

      return currentLocationHash as BlockTypes;
    }

    return null;
  }

  registerBlockChange(blockType: BlockTypes) {
    if (!this.#handleNavigationEvents) {
      return;
    }

    // for block types that mark the end of an auth process we do not want to change the hash
    if (blockType === BlockTypes.Completed || blockType === BlockTypes.ContinueOnOtherEnv) {
      return;
    }

    history.pushState(null, '', `#${blockType}`);
  }

  dispose() {
    if (!this.#handleNavigationEvents) {
      return;
    }

    this.#abortController.abort();
  }

  #getCurrentLocationHash() {
    return window.location.hash.replace('#', '');
  }
}
