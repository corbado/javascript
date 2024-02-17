import type { CorbadoApp } from '@corbado/web-core';
import type { GeneralBlockPasskeyAppend } from '@corbado/web-core/dist/api/v2';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { FlowHandler } from '../flowHandler';
import type { BlockDataPasskeyAppend } from '../types';
import { Block } from './Block';

export class PasskeyAppendBlock extends Block<BlockDataPasskeyAppend> {
  readonly data: BlockDataPasskeyAppend;
  readonly type = BlockTypes.PasskeyAppend;
  readonly initialScreen = ScreenNames.PasskeyAppend;

  constructor(app: CorbadoApp, flowHandler: FlowHandler, _: ErrorTranslator, __: GeneralBlockPasskeyAppend) {
    super(app, flowHandler);

    this.data = {
      availableFallbacks: [],
      userHandle: '',
    };
  }

  showPasskeyBenefits() {
    this.updateScreen(ScreenNames.PasskeyBenefits);
  }

  passkeyAppend() {
    return;
  }

  initFallbackEmailOtp() {
    return;
  }

  initFallbackSmsOtp() {
    return;
  }

  initFallbackEmailLink() {
    return;
  }
}
