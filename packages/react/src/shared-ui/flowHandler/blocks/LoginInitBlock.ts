import type {
  CorbadoTracker,
  LoginMethodType,
  ProvideIdentifierOperation,
  SocialLoginProviderType,
} from '@corbado/observe';
import type {
  BlockBody,
  CorbadoApp,
  GeneralBlockLoginInit,
  ProcessCommon,
  SocialProviderType,
} from '@corbado/web-core';
import { AuthType, BlockType, PasskeyChallengeCancelledError, SocialDataStatusEnum } from '@corbado/web-core';
import log from 'loglevel';

import { BlockTypes, ScreenNames } from '../constants';
import type { ErrorTranslator } from '../errorTranslator';
import type { ProcessHandler } from '../processHandler';
import type { BlockDataLoginInit } from '../types';
import { Block } from './Block';
import { providersToSocialLoginMethods } from '../../utils/observe';

export class LoginInitBlock extends Block<BlockDataLoginInit> {
  readonly data: BlockDataLoginInit;
  readonly type = BlockTypes.LoginInit;
  readonly authType = AuthType.Login;
  readonly initialScreen = ScreenNames.LoginInit;
  #conditionalUIStarted = false;
  #provideIdentifierOp: ProvideIdentifierOperation | undefined;

  constructor(
    app: CorbadoApp,
    flowHandler: ProcessHandler,
    common: ProcessCommon,
    errorTranslator: ErrorTranslator,
    blockBody: BlockBody,
    observeTracker?: CorbadoTracker,
  ) {
    super(app, flowHandler, common, errorTranslator, observeTracker);

    const data = blockBody.data as GeneralBlockLoginInit;
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

  onPageLoad() {
    const hasPasskeyButton = this.data.lastIdentifier;
    this.observeTracker?.loginVisible({
      identifierPrefillingExisted: !!hasPasskeyButton,
    });

    if (hasPasskeyButton) {
      this.#observePasskeyButtonDecisionVisible();
    } else {
      this.#observePreLoginDecision();
    }
  }

  setProvideIdentifierOp(op: ProvideIdentifierOperation) {
    this.#provideIdentifierOp = op;
  }

  destroyProvideIdentifierOp() {
    this.#provideIdentifierOp?.destroy();
    this.#provideIdentifierOp = undefined;
  }

  async start(loginIdentifier: string, isPhone: boolean, isStartedFromPasskeyButton: boolean) {
    if (isStartedFromPasskeyButton) {
      this.#observePasskeyButtonDecision('accept');
    }

    this.#provideIdentifierOp?.identifierSubmitted({});

    const b = await this.app.authProcessService.initLogin(loginIdentifier, isPhone);
    if (b.err) {
      if (!b.val.ignore) {
        this.#provideIdentifierOp?.identifierError({ error: b.val });
      }
    } else if (b.val.blockBody.block === BlockType.LoginInit) {
      this.#provideIdentifierOp?.identifierError({});
    } else {
      this.#provideIdentifierOp?.identifierFinished({});
    }

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

    const challenge = this.data.conditionalUIChallenge;
    if (this.observeTracker) {
      this.#provideIdentifierOp?.conditionalUIStartable({ assertionOptions: challenge });
    }

    const b = await this.app.authProcessService.loginWithPasskeyChallenge(challenge, data => {
      onAuthenticatorCompleted?.();
      this.#provideIdentifierOp?.conditionalUISubmitted({ assertionResponse: data.assertionResponse });
    });

    if (b.err && (b.val.ignore || b.val instanceof PasskeyChallengeCancelledError)) {
      if (b.val instanceof PasskeyChallengeCancelledError) {
        this.#provideIdentifierOp?.conditionalUIClientError({ error: b.val });
      }

      return;
    }

    if (b.err) {
      this.#provideIdentifierOp?.conditionalUIServerErrorUnknown(b.val);
    } else {
      const data = b.val.blockBody.data as GeneralBlockLoginInit;
      if (data.fieldError?.code === 'invalid_conditional_ui_login') {
        this.#provideIdentifierOp?.conditionalUIServerErrorConditionalUICredentialDeleted();
      } else {
        this.#provideIdentifierOp?.conditionalUIFinished({});
      }
    }

    this.updateProcess(b);
  }

  async startSocialVerify(providerType: SocialProviderType) {
    this.observeTracker?.socialLoginStart({
      provider: this.#toObservableSocialProvider(providerType),
      explicitSpecType: 'pre-identifier',
    });
    const redirectUrl = window.location.origin + window.location.pathname;
    const res = await this.app.authProcessService.startSocialVerification(providerType, redirectUrl, AuthType.Login);
    if (!res) {
      return;
    }

    this.updateProcess(res);
  }

  async finishSocialVerify(abortController: AbortController) {
    const res = await this.app.authProcessService.finishSocialVerification(abortController);
    if (res.ok) {
      const data = res.val.blockBody.data as GeneralBlockLoginInit;
      if (data.error) {
        this.observeTracker?.socialLoginError({ errorCode: data.error.code });
      } else {
        this.observeTracker?.socialLoginFinish({ provider: this.#toObservableSocialProvider('google') });
      }
    } else if (!res.val.ignore) {
      this.observeTracker?.socialLoginError({ errorCode: res.val.name ?? 'unknown' });
    }

    this.updateProcess(res);
  }

  discardOfferedLastIdentifier() {
    this.#observePasskeyButtonDecision('discard');
    this.app.authProcessService.dropLastIdentifier(undefined);
    this.#observePreLoginDecision();
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

  #toObservableSocialProvider(provider: SocialProviderType): SocialLoginProviderType {
    switch (provider) {
      case 'google':
        return 'google';
      case 'github':
        return 'github';
      case 'microsoft':
        return 'microsoft';
      default:
        return 'other';
    }
  }

  #observePreLoginDecision() {
    const methods: LoginMethodType[] = ['identifier-email'];

    if (this.data.conditionalUIChallenge) {
      methods.push('passkey-conditional-ui');
    }
    methods.push(...providersToSocialLoginMethods(this.data.socialData.providers));

    if (methods.length > 0) {
      this.observeTracker?.loginMethodsDecisionOffered({
        decisionName: 'pre-identifier',
        availableMethods: methods,
      });
    }
  }

  #observePasskeyButtonDecisionVisible() {
    this.observeTracker?.authDecisionVisible({
      decisionName: 'passkey-button',
      options: ['accept', 'discard'],
    });
  }

  #observePasskeyButtonDecision(explicitDecisionValue: string) {
    this.observeTracker?.authDecisionFinished({
      decisionName: 'passkey-button',
      options: ['accept', 'discard'],
      explicitDecisionValue: explicitDecisionValue,
    });
  }
}
