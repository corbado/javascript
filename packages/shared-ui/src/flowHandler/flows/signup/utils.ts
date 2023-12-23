import type { AppendPasskeyError, CorbadoApp, SignUpWithPasskeyError } from '@corbado/web-core';
import {
  InvalidEmailError,
  InvalidFullnameError,
  InvalidOtpInputError,
  UnknownError,
  UserAlreadyExistsError,
} from '@corbado/web-core';
import type { Result } from 'ts-results';
import { Err, Ok } from 'ts-results';

import { PasskeySignupWithEmailOtpFallbackScreens } from '../../constants';
import type { FlowHandlerState } from '../../flowHandlerState';
import { FlowUpdate } from '../../flowUpdate';
import type { UserState } from '../../types';

export const validateEmailAndFullName = (
  userStateIn?: UserState,
  onStartScreen = false,
): Result<{ email: string; fullName: string }, FlowUpdate> => {
  let userState: UserState = {};

  if (!userStateIn?.email) {
    userState = { emailError: new InvalidEmailError() };
  }

  if (!userStateIn?.fullName) {
    userState = { ...userState, userNameError: new InvalidFullnameError() };
  }

  if (userStateIn?.email && userStateIn.fullName) {
    return Ok({ email: userStateIn.email, fullName: userStateIn.fullName });
  }

  userState = { ...userState, email: userStateIn?.email, fullName: userStateIn?.fullName };

  return onStartScreen
    ? Err(FlowUpdate.state(userState))
    : Err(FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start, userState));
};

export const validateUserAuthState = (state: FlowHandlerState): Result<undefined, FlowUpdate> => {
  if (!state.user) {
    return Err(
      FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start, {
        emailError: new UnknownError(),
        fullName: state.userState.fullName,
        email: state.userState.email,
      }),
    );
  }

  return Ok(undefined);
};

export const checkUserExists = async (
  corbadoApp: CorbadoApp,
  email: string,
  fullName: string,
): Promise<Result<undefined, FlowUpdate>> => {
  const res = await corbadoApp.authService.userExists(email);

  if (res.err) {
    return Err(FlowUpdate.state({ email, fullName, emailError: new UnknownError() }));
  }

  if (res.val) {
    return Err(
      FlowUpdate.state({
        email,
        fullName,
        emailError: new UserAlreadyExistsError(),
      }),
    );
  }

  return Ok(undefined);
};

export const sendEmailOTP = async (
  corbadoApp: CorbadoApp,
  email: string,
  fullName: string,
  onStartScreen = false,
): Promise<FlowUpdate> => {
  const res = await corbadoApp.authService.initSignUpWithEmailOTP(email, fullName);

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
  corbadoApp: CorbadoApp,
  email: string,
  fullName: string,
): Promise<Result<FlowUpdate, SignUpWithPasskeyError | undefined>> => {
  const res = await corbadoApp.authService.signUpWithPasskey(email, fullName);
  if (res.ok) {
    return Ok(FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome));
  }

  return res;
};

export const appendPasskey = async (
  corbadoApp: CorbadoApp,
): Promise<Result<FlowUpdate, AppendPasskeyError | undefined>> => {
  const res = await corbadoApp.authService.appendPasskey();
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
