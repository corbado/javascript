import type { BlockBody, CorbadoApp, CorbadoError, ProcessCommon } from '@corbado/web-core';
import type { AuthType } from '@corbado/web-core';
import { Ok, type Result } from 'ts-results';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataSocialVerify } from '../types';
import { Block } from './Block';

export class SocialVerifyBlock extends Block<BlockDataSocialVerify> {
  readonly data: BlockDataSocialVerify = {};
  readonly type = BlockTypes.SocialVerify;
  readonly initialScreen = ScreenNames.SocialLinkVerification;
  readonly authType: AuthType;
  readonly socialLinkToken?: string;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    blockBody: BlockBody,
    socialLinkToken?: string,
  ) {
    super(app, flowHandler, common, errorTranslator);

    this.authType = blockBody.authType;
    this.socialLinkToken = socialLinkToken;
  }

  async startSocialVerification(_: AbortController): Promise<Result<void, CorbadoError>> {
    if (!this.socialLinkToken) {
      throw new Error('Social link token is missing');
    }

    const res = await this.app.authProcessService.resetAuthProcess();

    this.updateProcess(res);

    return Ok(void 0);
  }
}
