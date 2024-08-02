import type { CorbadoApp, GeneralBlockLoginInit, ProcessCommon } from '@corbado/web-core';
import { AuthType, PasskeyChallengeCancelledError, SocialDataStatusEnum } from '@corbado/web-core';
import type { SocialProviderType } from '@corbado/web-core/dist/api/v2';
import log from 'loglevel';

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
  #conditionalUIStarted = false;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    data: GeneralBlockLoginInit,
  ) {
    super(app, flowHandler, common, errorTranslator);

    const loginIdentifierError = errorTranslator.translate(data.fieldError);
    const lastIdentifierError = app.authProcessService.getLastIdentifier();

    this.data = {
      loginIdentifier: data.identifierValue ?? '',
      loginIdentifierError: loginIdentifierError ?? '',
      lastIdentifier: lastIdentifierError,
      isPhoneFocused: data.isPhone,
      emailEnabled: data.isEmailAvailable,
      usernameEnabled: data.isUsernameAvailable,
      phoneEnabled: data.isPhoneAvailable,
      conditionalUIChallenge: data.conditionalUIChallenge,
      socialData: {
        providers:
          data.socialData?.providers?.map(provider => {
            return { name: provider };
          }) || [],
        oAuthUrl: data.socialData?.oauthUrl,
        started: data.socialData?.status === SocialDataStatusEnum.Started || false,
        finished: data.socialData?.status === SocialDataStatusEnum.Finished || false,
      },
    };

    // errors in social logins should not be displayed in the login form (like we do for identifiers) but should appear on top of the screen
    if (data.error) {
      this.setError(data.error);
    }
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

  // only if the browser supports conditional UI and is not affected by user gesture detection we start conditional UI on initial page load
  async startConditionalUIOnPageLoad(): Promise<boolean> {
    const supported = await this.app.authProcessService.isConditionalUISupported();
    if (!supported) {
      return false;
    }

    return !this.#isEnvAffectedByUserGestureDetection();
  }

  // only if the browser supports conditional UI and browser is affected by user gesture detection we start conditional UI on first user interaction
  async startConditionalUIOnFirstUserInteraction(): Promise<boolean> {
    const supported = await this.app.authProcessService.isConditionalUISupported();
    if (!supported) {
      return false;
    }

    return this.#isEnvAffectedByUserGestureDetection();
  }

  async continueWithConditionalUI({ onAuthenticatorCompleted }: { onAuthenticatorCompleted?: () => void }) {
    if (!this.data.conditionalUIChallenge) {
      return;
    }

    if (this.#conditionalUIStarted) {
      log.debug('Conditional UI already started');
      return;
    }

    this.#conditionalUIStarted = true;
    log.debug('starting conditional UI');
    const b = await this.app.authProcessService.loginWithPasskeyChallenge(
      this.data.conditionalUIChallenge,
      onAuthenticatorCompleted,
    );

    if (b.err && (b.val instanceof PasskeyChallengeCancelledError || b.val.ignore)) {
      // we ignore this type of error
      return;
    }
    this.updateProcess(b);
  }

  async startSocialVerify(providerType: SocialProviderType) {
    const redirectUrl = window.location.origin + window.location.pathname;
    const res = await this.app.authProcessService.startSocialVerification(providerType, redirectUrl, AuthType.Login);
    if (!res) {
      return;
    }

    this.updateProcess(res);
  }

  async finishSocialVerify(abortController: AbortController) {
    const res = await this.app.authProcessService.finishSocialVerification(abortController);
    this.updateProcess(res);
  }

  discardOfferedLastIdentifier() {
    this.app.authProcessService.dropLastIdentifier(undefined);
  }

  #isEnvAffectedByUserGestureDetection(): boolean {
    // parse user-agent to check if the browser is WebKit on iOS/iPadOS and version is below 17.4
    const userAgent = navigator.userAgent;
    const isWebKit = userAgent.includes('WebKit');
    const isIOS = userAgent.includes('iPhone') || userAgent.includes('iPad');

    if (!isWebKit || !isIOS) {
      return false;
    }

    // we are pessimistic here and assume that by default the version is below 17.4
    const m = userAgent.match(/iPhone OS ([\d_]+)/);
    let safariVersionAboveOrEqual174 = false;
    if (m && m.length > 1) {
      const version = m[1];
      const versionParts = version.split('.');
      if (versionParts.length > 1) {
        const major = parseInt(versionParts[0], 10);
        const minor = parseInt(versionParts[1], 10);
        safariVersionAboveOrEqual174 = major > 17 || (major === 17 && minor >= 4);
      }
    }

    log.debug(isWebKit, isIOS, safariVersionAboveOrEqual174);

    // all mobile WebKit browsers that have a iOS version < 17.4 are affected by user gesture detection
    return !safariVersionAboveOrEqual174;
  }
}
