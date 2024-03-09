import type { AuthType, ContinueOnOtherDevice, CorbadoApp, ProcessCommon } from '@corbado/web-core';
import { ContinueOnOtherDeviceReasonEnum } from '@corbado/web-core';

import { BlockTypes, ContinueOnOtherEnvReasons, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataContinueOnOtherEnv } from '../types';
import { Block } from './Block';

export class ContinueOnOtherEnvBlock extends Block<BlockDataContinueOnOtherEnv> {
  readonly data: BlockDataContinueOnOtherEnv;
  readonly type = BlockTypes.ContinueOnOtherEnv;
  readonly initialScreen = ScreenNames.ContinueOnOtherEnv;
  readonly authType: AuthType;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    authType: AuthType,
    continueOnOtherDevice: ContinueOnOtherDevice,
  ) {
    super(app, flowHandler, common, errorTranslator);

    this.authType = authType;
    this.data = { reason: this.#mapReasonToEnum(continueOnOtherDevice.reason) };
  }

  #mapReasonToEnum(r: ContinueOnOtherDeviceReasonEnum): ContinueOnOtherEnvReasons {
    switch (r) {
      case ContinueOnOtherDeviceReasonEnum.EmailLinkVerified:
        return ContinueOnOtherEnvReasons.EmailLinkVerified;
      case ContinueOnOtherDeviceReasonEnum.ProcessAlreadyCompleted:
        return ContinueOnOtherEnvReasons.ProcessAlreadyCompleted;
      default:
        return ContinueOnOtherEnvReasons.ProcessAlreadyCompleted;
    }
  }
}
