import type { BlockTypes } from './constants';

export class ProcessHistoryHandler {
  #enabled: boolean;
  #abortController: AbortController;

  constructor(enabled: boolean) {
    this.#enabled = enabled;
    this.#abortController = new AbortController();
  }

  init(maybeSwitchToBlock: (blockType: BlockTypes) => boolean, askForAbort: () => void) {
    console.log('init ProcessHistoryHandler');
    if (!this.#enabled) {
      return;
    }

    window.addEventListener(
      'hashchange',
      () => {
        const blockNameFromHash = location.hash.replace('#', '');

        const blockType = blockNameFromHash as BlockTypes;
        console.log('hashchange', blockNameFromHash, blockType);

        const switchWasPossible = maybeSwitchToBlock(blockType);

        if (!switchWasPossible) {
          askForAbort();
          return;
        }
      },
      { signal: this.#abortController.signal },
    );
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

    console.log('stop ProcessHistoryHandler');
    this.#abortController.abort();
  }
}
