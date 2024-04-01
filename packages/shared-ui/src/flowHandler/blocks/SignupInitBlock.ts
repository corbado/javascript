import type { CorbadoApp, ProcessCommon } from '@corbado/web-core';
import { AuthType } from '@corbado/web-core';
import type { GeneralBlockSignupInit, LoginIdentifier } from '@corbado/web-core/dist/api/v2';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataSignupInit, LoginIdentifiers, TextFieldWithError } from '../types';
import { Block } from './Block';

export class SignupInitBlock extends Block<BlockDataSignupInit> {
  readonly data: BlockDataSignupInit;
  readonly type = BlockTypes.SignupInit;
  readonly authType = AuthType.Signup;
  readonly initialScreen = ScreenNames.SignupInit;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    data: GeneralBlockSignupInit,
  ) {
    super(app, flowHandler, common, errorTranslator);

    let email: TextFieldWithError | null = null;
    let phone: TextFieldWithError | null = null;
    let userName: TextFieldWithError | null = null;
    let fullName: TextFieldWithError | null = null;

    data.identifiers.forEach(item => {
      switch (item.type) {
        case 'email':
          email = {
            value: item.identifier,
            translatedError: errorTranslator.translateWithIdentifier(item.error, item.type),
          };
          break;
        case 'phone':
          phone = {
            value: item.identifier,
            translatedError: errorTranslator.translateWithIdentifier(item.error, item.type),
          };
          break;
        case 'username':
          userName = {
            value: item.identifier,
            translatedError: errorTranslator.translateWithIdentifier(item.error, item.type),
          };
          break;
      }
    });

    if (data.fullName) {
      fullName = { value: data.fullName.fullName, translatedError: errorTranslator.translate(data.fullName.error) };
    }

    this.data = {
      fullName: fullName,
      email: email,
      phone: phone,
      userName: userName,
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
        {
          name: 'github',
          icon: `https://s3-alpha-sig.figma.com/img/606b/f5b6/b9784fe4f74b3e813c39da7657797479?Expires=1712534400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=TwnGj2FVpKTDUjEf7VW6g2KUEYEtmcH-Ssv64-~2Q4whkG7ac9T2CKFnyKjAZ0u8JzFL9W575~RhstSaQvzfq~gM6iR8U0-NUYd6F4kpxnOvvTiW~mNbFeURAal~--yih-vCN6Js4GsT3ExYCYINLVIoJoE02MaQA56WHqbojIrQCYtXdpP1z8moIkIGt4QN-ddVvA~9z6WOOGck1U2ssAjN8~ROd76UnztSlIORP3RUUcc4CUCsUReR2gHCMsrRXQVxqu4hAsM5ICkFxu4edEZK2vJVQkTVSfpguI9tNCYeek1X~7isdl2ZAlbicRHGPYIFLerO8XDcfeE4ftPpPw__`,
          url: 'https://www.corbado.com/',
        },
      ],
    };
  }

  async updateUserData(identifiers: LoginIdentifiers, fullName?: string) {
    const loginIdentifiers: LoginIdentifier[] = [];
    if (identifiers.email) {
      loginIdentifiers.push({ type: 'email', identifier: identifiers.email });
    }
    if (identifiers.phone) {
      loginIdentifiers.push({ type: 'phone', identifier: identifiers.phone });
    }
    if (identifiers.userName) {
      loginIdentifiers.push({ type: 'username', identifier: identifiers.userName });
    }

    const b = await this.app.authProcessService.initSignup(loginIdentifiers, fullName);
    this.updateProcess(b);
  }

  switchToLogin() {
    const newPrimary = this.alternatives[0];
    const newAlternatives = [this];
    this.updateProcessFrontend(newPrimary, newAlternatives);
  }
}
