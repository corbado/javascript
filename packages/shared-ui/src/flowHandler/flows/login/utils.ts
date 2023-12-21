import type { AuthService } from '@corbado/web-core';
import {
  InvalidEmailError,
  NoPasskeyAvailableError,
  PasskeyChallengeCancelledError,
  UnknownError,
  UnknownUserError,
} from '@corbado/web-core';

import { PasskeyLoginWithEmailOtpFallbackScreens } from '../../constants';
import type { FlowHandlerState } from '../../flowHandlerState';
import { FlowUpdate } from '../../flowUpdate';
import type { UserState } from '../../types';

export const sendEmailOTP = async (authService: AuthService, email?: string): Promise<FlowUpdate> => {
  if (!email) {
    return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.Start, {
      emailError: new InvalidEmailError(),
    });
  }

  const res = await authService.initLoginWithEmailOTP(email);

  if (res.ok) {
    return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.EnterOtp, {
      emailOTPState: { lastMailSent: new Date() },
      email: email,
    });
  }

  return FlowUpdate.state({ emailError: new UnknownError() });
};

export const initPasskeyAppend = async (
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

export const loginWithPasskey = async (
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

    if (res.val instanceof PasskeyChallengeCancelledError) {
      return sendEmailOTP(state.corbadoApp.authService, email);
    }

    return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.PasskeyError, userStateUpdate);
  }

  return initPasskeyAppend(state, email, userStateUpdate);
};
