import type { BlockTypes } from './constants';

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
      return currentLocationHash as BlockTypes;
    }

    return null;
  }

  registerBlockChange(blockType: BlockTypes) {
    if (!this.#enabled) {
      return;
    }

    window.location.hash = blockType;
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
