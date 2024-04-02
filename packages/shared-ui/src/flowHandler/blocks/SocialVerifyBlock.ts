import type { AuthType, BlockBody, CorbadoApp, GeneralBlockSocialVerify, ProcessCommon } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataSocialVerify } from '../types';
import { Block } from './Block';

export class SocialVerifyBlock extends Block<BlockDataSocialVerify> {
  readonly data: BlockDataSocialVerify = {};
  readonly type = BlockTypes.SocialVerify;
  readonly initialScreen = ScreenNames.SocialVerify;
  readonly authType: AuthType;
  readonly oAuthUrl: string;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    blockBody: BlockBody,
  ) {
    super(app, flowHandler, common, errorTranslator);
    const data = blockBody.data as GeneralBlockSocialVerify;

    this.authType = blockBody.authType;
    this.oAuthUrl = data.oauthUrl;
  }

  startSocialVerification(_: AbortController): void {
    window.location.href = this.oAuthUrl;
  }
}
