import { FlowHandlerEvents, FlowType, ScreenNames } from '../../constants';
import { FlowUpdate } from '../../flowUpdate';
import type { Flow } from '../../types';
import {
  appendPasskey,
  initConditionalUI,
  initLoginWithVerificationMethod,
  initPasskeyAppend,
  loginWithEmailLink,
  loginWithEmailOTP,
  loginWithPasskey,
  sendEmailLinkAgain,
  validateEmail,
  validateUserAuthState,
} from './utils';

export const PasskeyLoginWithFallbackFlow: Flow = {
  [ScreenNames.Start]: async (state, event, eventOptions) => {
    switch (event) {
      case FlowHandlerEvents.ChangeFlow:
        return FlowUpdate.changeFlow(FlowType.SignUp);
      case FlowHandlerEvents.PrimaryButton: {
        const validations = validateEmail(eventOptions?.userStateUpdate, true);
        if (validations.err) {
          return validations.val;
        }
        const email = validations.val;

        if (!state.passkeysSupported) {
          return await initLoginWithVerificationMethod(state.corbadoApp.authService, state.flowOptions, email);
        }

        return loginWithPasskey(state.corbadoApp.authService, state.flowOptions, email);
      }
      case FlowHandlerEvents.InitConditionalUI: {
        return initConditionalUI(state);
      }
    }

    return;
  },
  [ScreenNames.EmailOTPVerification]: async (state, event, eventOptions) => {
    const validations = validateEmail(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const email = validations.val;

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        const res = await loginWithEmailOTP(
          state.corbadoApp.authService,
          state.userState,
          eventOptions?.verificationCode,
        );
        if (res.err) {
          return res.val;
        }

        return initPasskeyAppend(state, email);
      }
      case FlowHandlerEvents.SecondaryButton: {
        // TODO: add OTP resend
        return undefined;
      }
      case FlowHandlerEvents.CancelOTP:
        return FlowUpdate.navigate(ScreenNames.Start, { email });
    }
    return FlowUpdate.state({});
  },

  [ScreenNames.EmailLinkSent]: (state, event) => {
    const validations = validateEmail(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const email = validations.val;

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        return sendEmailLinkAgain(state.corbadoApp.authService, email);
      }
      case FlowHandlerEvents.CancelEmailLink:
        return FlowUpdate.navigate(ScreenNames.Start);
    }

    return;
  },

  [ScreenNames.EmailLinkVerification]: async (state, event) => {
    switch (event) {
      case FlowHandlerEvents.VerifyLink: {
        const res = await loginWithEmailLink(state.corbadoApp.authService, state.userState);
        if (res.err) {
          return res.val;
        }

        return initPasskeyAppend(state, state.user?.email ?? '');
      }
      case FlowHandlerEvents.CancelEmailLink:
        window.location.search = '';
        return FlowUpdate.navigate(ScreenNames.Start);
    }
    return FlowUpdate.state({});
  },

  [ScreenNames.PasskeyAppend]: async (state, event): Promise<FlowUpdate | undefined> => {
    const validations = validateUserAuthState(state);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        return await appendPasskey(state.corbadoApp.authService, state.flowOptions.retryPasskeyOnError);
      case FlowHandlerEvents.SecondaryButton:
        return Promise.resolve(FlowUpdate.navigate(ScreenNames.End));
      case FlowHandlerEvents.ShowBenefits:
        return Promise.resolve(FlowUpdate.navigate(ScreenNames.PasskeyBenefits));
    }

    return Promise.resolve(undefined);
  },

  [ScreenNames.PasskeyError]: async (state, event) => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        if (state.user) {
          return await appendPasskey(state.corbadoApp.authService, state.flowOptions.retryPasskeyOnError);
        }

        const credValRes = validateEmail(state.userState);

        if (credValRes.err) {
          return credValRes.val;
        }

        const email = credValRes.val;

        return await loginWithPasskey(state.corbadoApp.authService, state.flowOptions, email);
      }
      case FlowHandlerEvents.SecondaryButton: {
        if (state.user) {
          return FlowUpdate.navigate(ScreenNames.End);
        }

        const credValRes = validateEmail(state.userState);

        if (credValRes.err) {
          return credValRes.val;
        }

        const email = credValRes.val;

        return await initLoginWithVerificationMethod(state.corbadoApp.authService, state.flowOptions, email);
      }
      case FlowHandlerEvents.CancelPasskey:
        return FlowUpdate.navigate(ScreenNames.End);
    }
    return FlowUpdate.state({});
  },

  [ScreenNames.PasskeyBenefits]: async (state, event) => {
    const validations = validateUserAuthState(state);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        return await appendPasskey(state.corbadoApp.authService, state.flowOptions.retryPasskeyOnError);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(ScreenNames.End);
    }

    return undefined;
  },
};
