import { BlockTypes } from './constants';

export class ProcessHistoryHandler {
  #enabled: boolean;
  #abortController: AbortController;

  constructor(enabled: boolean) {
    this.#enabled = enabled;
    this.#abortController = new AbortController();
  }

  init(maybeSwitchToBlock: (blockType: BlockTypes) => boolean, askForAbort: () => void): BlockTypes | null {
    if (!this.#enabled) {
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

  registerBlockChange(blockType: BlockTypes, forcePush = false) {
    if (!this.#enabled) {
      return;
    }

    // for block types that mark the end of an auth process we do not want to change the hash
    if (blockType === BlockTypes.Completed || blockType === BlockTypes.ContinueOnOtherEnv) {
      return;
    }

    if (location.hash && !forcePush) {
      history.replaceState(null, '', `#${blockType}`);
    } else {
      history.pushState(null, '', `#${blockType}`);
    }
  }

  dispose() {
    if (!this.#enabled) {
      return;
    }

    this.#abortController.abort();
  }

  #getCurrentLocationHash() {
    return window.location.hash.replace('#', '');
  }
}
