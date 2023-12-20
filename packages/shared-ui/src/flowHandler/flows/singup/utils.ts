import type { AppendPasskeyError, CorbadoApp, SignUpWithPasskeyError } from '@corbado/web-core';
import {
  InvalidEmailError,
  InvalidFullnameError,
  InvalidOtpInputError,
  UnknownError,
  UserAlreadyExistsError,
} from '@corbado/web-core';
import type { Result } from 'ts-results';
import { Ok } from 'ts-results';

import { PasskeySignupWithEmailOtpFallbackScreens } from '../../constants';
import type { FlowHandlerState } from '../../flowHandlerState';
import { FlowUpdate } from '../../flowUpdate';
import type { UserState } from '../../types';

export const checkErrors = (email?: string, fullName?: string, onStartScreen = false): FlowUpdate | undefined => {
  let userState: UserState | null = null;

  if (!email) {
    userState = { emailError: new InvalidEmailError() };
  }

  if (!fullName) {
    userState = { ...userState, userNameError: new InvalidFullnameError() };
  }

  if (!userState) {
    return undefined;
  }

  return onStartScreen
    ? FlowUpdate.state(userState)
    : FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start, userState);
};

export const checkErrorsAfterAuth = (state: FlowHandlerState): FlowUpdate | undefined => {
  if (!state.user) {
    return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start, { emailError: new UnknownError() });
  }

  return undefined;
};

export const checkUserExistsError = async (
  corbadoApp: CorbadoApp,
  email?: string,
  userState?: UserState,
): Promise<FlowUpdate | undefined> => {
  const res = await corbadoApp.authService.userExists(email ?? '');

  if (res.err) {
    return FlowUpdate.state({ emailError: new UnknownError(), ...(userState ?? {}) });
  }

  if (res.val) {
    return FlowUpdate.state({
      ...(userState ?? {}),
      emailError: new UserAlreadyExistsError(),
    });
  }

  return undefined;
};

export const sendEmailOTP = async (
  corbadoApp: CorbadoApp,
  email?: string,
  fullName?: string,
  onStartScreen = false,
): Promise<FlowUpdate> => {
  const errors = checkErrors(email, fullName, onStartScreen);
  if (errors) {
    return errors;
  }

  const res = await corbadoApp.authService.initSignUpWithEmailOTP(email ?? '', fullName ?? '');

  if (res.ok) {
    return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.EnterOtp, {
      emailOTPState: { lastMailSent: new Date() },
    });
  }

  return onStartScreen
    ? FlowUpdate.state({ emailError: new UnknownError() })
    : FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start, { emailError: new UnknownError() });
};

export const createPasskey = async (
  state: FlowHandlerState,
): Promise<Result<FlowUpdate, SignUpWithPasskeyError | undefined>> => {
  const errors = checkErrors(state.userState.email, state.userState.fullName);
  if (errors) {
    return Ok(errors);
  }

  const res = await state.corbadoApp.authService.signUpWithPasskey(
    state.userState.email ?? '',
    state.userState.fullName ?? '',
  );
  if (res.ok) {
    return Ok(FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome));
  }

  return res;
};

export const appendPasskey = async (
  state: FlowHandlerState,
): Promise<Result<FlowUpdate, AppendPasskeyError | undefined>> => {
  const errors = checkErrorsAfterAuth(state);
  if (errors) {
    return Ok(errors);
  }

  const res = await state.corbadoApp.authService.appendPasskey();
  if (res.ok) {
    return Ok(FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome));
  }

  return res;
};

export const signupWithEmailOTP = async (corbadoApp: CorbadoApp, otp?: string): Promise<FlowUpdate | undefined> => {
  if (!otp) {
    return FlowUpdate.state({ emailOTPError: new InvalidOtpInputError() });
  }

  const res = await corbadoApp.authService.completeSignupWithEmailOTP(otp);
  if (res.ok) {
    return undefined;
  }

  if (res.val instanceof InvalidOtpInputError) {
    return FlowUpdate.state({ emailOTPError: res.val });
  }

  return FlowUpdate.state({ emailOTPError: new UnknownError() });
};
