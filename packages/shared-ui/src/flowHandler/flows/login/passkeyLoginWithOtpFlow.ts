import { FlowHandlerEvents, FlowType, PasskeyLoginWithEmailOtpFallbackScreens } from '../../constants';
import { FlowUpdate } from '../../flowUpdate';
import type { Flow } from '../../types';
import {
  appendPasskey,
  initConditionalUI,
  initPasskeyAppend,
  loginWithEmailOTP,
  loginWithPasskey,
  sendEmailOTP,
  validateEmail,
  validateUserAuthState,
} from './utils';

export const PasskeyLoginWithEmailOTPFallbackFlow: Flow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: async (state, event, eventOptions) => {
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
          return await sendEmailOTP(state.corbadoApp.authService, email);
        }

        return loginWithPasskey(state.corbadoApp.authService, email);
      }
      case FlowHandlerEvents.InitConditionalUI: {
        return initConditionalUI(state);
      }
    }

    return;
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: async (state, event, eventOptions) => {
    const validations = validateEmail(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const email = validations.val;

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        const res = await loginWithEmailOTP(state.corbadoApp.authService, state.userState, eventOptions?.emailOTPCode);
        if (res.err) {
          return res.val;
        }

        return initPasskeyAppend(state, email);
      }
      case FlowHandlerEvents.SecondaryButton: {
        // TODO: add OTP resend
        return undefined;
      }
      case FlowHandlerEvents.CancelOtp:
        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.Start, { email });
    }
    return FlowUpdate.state({});
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: async (state, event): Promise<FlowUpdate | undefined> => {
    const validations = validateUserAuthState(state);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        return await appendPasskey(state.corbadoApp.authService);
      case FlowHandlerEvents.SecondaryButton:
        return Promise.resolve(FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End));
      case FlowHandlerEvents.ShowBenefits:
        return Promise.resolve(FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits));
    }

    return Promise.resolve(undefined);
  },

  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: async (state, event) => {
    const validations = validateEmail(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const email = validations.val;

    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        return loginWithPasskey(state.corbadoApp.authService, email);
      case FlowHandlerEvents.SecondaryButton:
        return sendEmailOTP(state.corbadoApp.authService, email);
    }
    return FlowUpdate.state({});
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits]: async (state, event) => {
    const validations = validateUserAuthState(state);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        return await appendPasskey(state.corbadoApp.authService);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End);
    }

    return undefined;
  },
};