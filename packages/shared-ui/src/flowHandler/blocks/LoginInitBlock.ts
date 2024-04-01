import type { CorbadoApp, GeneralBlockLoginInit, ProcessCommon } from '@corbado/web-core';
import { PasskeyChallengeCancelledError } from '@corbado/web-core';
import { AuthType } from '@corbado/web-core';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataLoginInit } from '../types';
import { Block } from './Block';

export class LoginInitBlock extends Block<BlockDataLoginInit> {
  readonly data: BlockDataLoginInit;
  readonly type = BlockTypes.LoginInit;
  readonly authType = AuthType.Login;
  readonly initialScreen = ScreenNames.LoginInit;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    data: GeneralBlockLoginInit,
  ) {
    super(app, flowHandler, common, errorTranslator);

    const loginIdentifierError = errorTranslator.translate(data.error);

    this.data = {
      loginIdentifier: data.identifierValue ?? '',
      loginIdentifierError: loginIdentifierError ?? '',
      isPhoneFocused: data.isPhone,
      emailEnabled: data.isEmailAvailable,
      usernameEnabled: data.isUsernameAvailable,
      phoneEnabled: data.isPhoneAvailable,
      conditionalUIChallenge: data.conditionalUIChallenge,
      socialLogins: [
        {
          name: 'google',
          icon: `https://s3-alpha-sig.figma.com/img/90d8/80c7/58591600bcb92fbb1ede52109628ab2b?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=fnwuJ3rop-rXNHCrwJJzfvSXZzhsTNgwEztBEiiS~pF4dOoZaf2Qn-bKY0qaa-Z3Im3bWlJ812KNwkmxy2L07-HnPXy6LbHy15EHT2tmHKe1cr9KMhnNzjFYrltKtXHHYQ9uJgBIHL0PSNq5lqvRQuZ7q7mWpU6p~XxshwI0R8DJpJQXCNj1JMssEz9zFaiOv-xe2rYoeh3E2v1HPPMU-mA3yhBzeobk4DxYhHa38yZupf1bENqAPWx0oj0rlz8f0g-QorYLvBBYvsnL0VJKf081F~ka5MRKNG9UH2JTghY00eCsgfQnAvYqJca0e9l35Jk3wk3rpkHDGjBUxleZEg__`,
          url: 'https://www.corbado.com/',
        },
        {
          name: 'microsoft',
          icon: `https://s3-alpha-sig.figma.com/img/028b/e4eb/67b2160da9762ec3df8b2cbd88ffeacd?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=REQGH-rXlt5jjIDv225KjzjTMlMJJ9AxqcIkmtizpsAjjqL1D~Mgc80kp6jr3W5KRsuAVsMiUD2RkAlSKEAI5hW6A-Z6QKI4zEux4e82C4RQkrehlMz3~oM3Z1vGU~tRi3lI-PFeVqE5tTLniT3TNboD5SXh3JP2SQ6ls6JuCe4XII4ZKI-AKl-VZrUEJMsR1W9FktalOyEDpwIKl178BQkEpp8JgfjpMESTSrWy7jYnsnM6~6h46nrq3V6xFWlkwjX3PCNOhrK1ubjU9K903Y~IyDYTupEK0VqJjBddYBocpLtWTVFXm7p5rIwkRrGeTS6Cq3K5~hZSDzcd600STw__`,
          url: 'https://www.corbado.com/',
        },
      ],
    };
  }

  async start(loginIdentifier: string, isPhone: boolean) {
    const b = await this.app.authProcessService.initLogin(loginIdentifier, isPhone);
    this.updateProcess(b);
  }

  switchToSignup() {
    const newPrimary = this.alternatives[0];
    const newAlternatives = [this];
    this.updateProcessFrontend(newPrimary, newAlternatives);
  }

  isSignupEnabled() {
    return this.alternatives.filter(b => b.type === BlockTypes.SignupInit).length > 0;
  }

  async continueWithConditionalUI() {
    if (!this.data.conditionalUIChallenge) {
      return;
    }

    const b = await this.app.authProcessService.loginWithPasskeyChallenge(this.data.conditionalUIChallenge);
    if (b.err && b.val instanceof PasskeyChallengeCancelledError) {
      // we ignore this type of error
      return;
    }

    this.updateProcess(b);
  }
}
