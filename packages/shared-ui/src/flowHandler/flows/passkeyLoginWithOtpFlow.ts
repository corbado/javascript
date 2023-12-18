import type { AuthService } from '@corbado/web-core';
import {
  InvalidEmailError,
  InvalidOtpInputError,
  NoPasskeyAvailableError,
  UnknownError,
  UnknownUserError,
} from '@corbado/web-core';

import {
  FlowHandlerEvents,
  FlowType,
  PasskeyLoginWithEmailOtpFallbackScreens,
  PasskeySignupWithEmailOtpFallbackScreens,
} from '../constants';
import { FlowUpdate } from '../stepFunctionResult';
import type { Flow, FlowHandlerState, UserState } from '../types';

const sendEmailOTP = async (authService: AuthService, email?: string): Promise<FlowUpdate> => {
  if (!email) {
    return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.Start, {
      emailError: new InvalidEmailError(),
    });
  }

  const res = await authService.initLoginWithEmailOTP(email);

  if (res.ok) {
    return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.EnterOtp, {
      emailOTPState: { lastMailSent: new Date() },
      email: email,
    });
  }

  return FlowUpdate.state({ emailError: new UnknownError() });
};

const initPasskeyAppend = async (
  state: FlowHandlerState,
  email: string,
  userStateUpdate?: UserState,
): Promise<FlowUpdate | undefined> => {
  if (!state.flowOptions.passkeyAppend) {
    return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End, userStateUpdate);
  }

  const authMethods = await state.corbadoApp.authService.authMethods(email);
  if (authMethods.err) {
    // TODO: non recoverable error
    return;
  }

  const userHasPasskey = authMethods.val.selectedMethods.includes('webauthn');
  if (!userHasPasskey) {
    return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend, userStateUpdate);
  }

  return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End, userStateUpdate);
};

const loginWithPasskey = async (
  state: FlowHandlerState,
  email: string,
  userStateUpdate?: UserState,
): Promise<FlowUpdate | undefined> => {
  const res = await state.corbadoApp.authService.loginWithPasskey(email);
  if (res.err) {
    if (res.val instanceof UnknownUserError) {
      return FlowUpdate.state({
        ...userStateUpdate,
        emailError: res.val,
      });
    }

    if (res.val instanceof NoPasskeyAvailableError) {
      return sendEmailOTP(state.corbadoApp.authService, email);
    }

    return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError, userStateUpdate);
  }

  return initPasskeyAppend(state, email, userStateUpdate);
};

export const PasskeyLoginWithEmailOTPFallbackFlow: Flow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: async (state, event, eventOptions) => {
    switch (event) {
      case FlowHandlerEvents.ChangeFlow:
        return FlowUpdate.changeFlow(FlowType.SignUp);
      case FlowHandlerEvents.PrimaryButton: {
        if (!state.passkeysSupported) {
          return await sendEmailOTP(state.corbadoApp.authService, eventOptions?.userStateUpdate?.email);
        }

        if (!eventOptions?.userStateUpdate?.email) {
          return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.Start, {
            emailError: new InvalidEmailError(),
          });
        }

        return loginWithPasskey(state, eventOptions?.userStateUpdate?.email, eventOptions?.userStateUpdate);
      }
      case FlowHandlerEvents.InitConditionalUI: {
        if (!state.passkeysSupported) {
          return;
        }

        const response = await state.corbadoApp.authService.loginWithConditionalUI();
        if (response.err) {
          // TODO: distinguish between an explicit and an implicit cancellation here
          return FlowUpdate.ignore();
        }

        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End);
      }
    }

    return;
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp]: async (state, event, eventOptions) => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        if (!eventOptions?.emailOTPCode) {
          return FlowUpdate.state({ emailOTPError: new InvalidOtpInputError() });
        }

        const res = await state.corbadoApp.authService.completeLoginWithEmailOTP(eventOptions?.emailOTPCode);
        if (res.err) {
          if (res.val instanceof InvalidOtpInputError) {
            return FlowUpdate.state({ emailOTPError: res.val });
          }

          return FlowUpdate.state({ emailOTPError: new UnknownError() });
        }

        if (!state.userState.email) {
          return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End);
        }

        return initPasskeyAppend(state, state.userState.email);
      }
      case FlowHandlerEvents.SecondaryButton: {
        // TODO: add OTP resend
        return undefined;
      }
      case FlowHandlerEvents.CancelOtp:
        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.Start, {
          email: state.userState.email,
          emailOTPState: undefined,
        });
    }
    return FlowUpdate.state({});
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: async (_, event) => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits);
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End);
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits);
    }

    return undefined;
  },

  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError]: async (state, event) => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        if (!state?.userState.email) {
          return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.Start, {
            emailError: new InvalidEmailError(),
          });
        }

        return loginWithPasskey(state, state?.userState.email);
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End);
    }
    return FlowUpdate.state({});
  },
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits]: async (state, event) => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        await state.corbadoApp.authService.appendPasskey();

        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End);
    }

    return undefined;
  },
};
