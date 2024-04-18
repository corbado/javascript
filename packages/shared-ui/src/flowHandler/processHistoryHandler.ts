import { BlockTypes } from './constants';

export class ProcessHistoryHandler {
  #skipHasedUrls: boolean;
  #abortController: AbortController;

  constructor(skipHasedUrls: boolean) {
    this.#skipHasedUrls = skipHasedUrls;
    this.#abortController = new AbortController();
  }

  init(maybeSwitchToBlock: (blockType: BlockTypes) => boolean, askForAbort: () => void): BlockTypes | null {
    if (this.#skipHasedUrls) {
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
    if (this.#skipHasedUrls) {
      return;
    }

    // for block types that mark the end of an auth process we do not want to change the hash
    if (blockType === BlockTypes.Completed || blockType === BlockTypes.ContinueOnOtherEnv) {
      return;
    }

    history.pushState(null, '', `#${blockType}`);
  }

  dispose() {
    if (this.#skipHasedUrls) {
      return;
    }

    this.#abortController.abort();
  }

  #getCurrentLocationHash() {
    return window.location.hash.replace('#', '');
  }
}
