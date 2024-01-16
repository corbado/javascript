import type { AuthService } from '@corbado/web-core';
import {
  InvalidEmailError,
  InvalidOtpInputError,
  NoPasskeyAvailableError,
  PasskeyChallengeCancelledError,
  UnknownError,
  UnknownUserError,
} from '@corbado/web-core';
import { Err, Ok, type Result } from 'ts-results';

import { ScreenNames } from '../../constants';
import type { FlowHandlerState } from '../../flowHandlerState';
import { FlowUpdate } from '../../flowUpdate';
import type { UserState } from '../../types';

export const validateEmail = (userStateIn?: UserState, onStartScreen = false): Result<string, FlowUpdate> => {
  if (userStateIn?.email) {
    return Ok(userStateIn.email);
  }

  const userState: UserState = { emailError: new InvalidEmailError(), email: userStateIn?.email };

  return onStartScreen ? Err(FlowUpdate.state(userState)) : Err(FlowUpdate.navigate(ScreenNames.Start, userState));
};

export const validateUserAuthState = (state: FlowHandlerState): Result<undefined, FlowUpdate> => {
  if (!state.user) {
    return Err(
      FlowUpdate.navigate(ScreenNames.Start, {
        emailError: new UnknownError(),
        email: state.userState.email,
      }),
    );
  }

  return Ok(undefined);
};

export const sendEmailOTP = async (authService: AuthService, email: string): Promise<FlowUpdate> => {
  const res = await authService.initLoginWithEmailOTP(email);

  if (res.ok) {
    return FlowUpdate.navigate(ScreenNames.EnterOTP, {
      emailOTPState: { lastMailSent: new Date() },
      email,
    });
  }

  return FlowUpdate.state({ emailError: new UnknownError(), email });
};

export const initPasskeyAppend = async (state: FlowHandlerState, email: string): Promise<FlowUpdate | undefined> => {
  if (!state.flowOptions.passkeyAppend) {
    return FlowUpdate.navigate(ScreenNames.End, { email });
  }

  const authMethods = await state.corbadoApp.authService.authMethods(email);
  if (authMethods.err) {
    // TODO: non recoverable error
    return;
  }

  const userHasPasskey = authMethods.val.selectedMethods.includes('webauthn');
  if (!userHasPasskey) {
    return FlowUpdate.navigate(ScreenNames.PasskeyAppend, { email });
  }

  return FlowUpdate.navigate(ScreenNames.End, { email });
};

export const loginWithPasskey = async (authService: AuthService, email: string): Promise<FlowUpdate | undefined> => {
  const userState: UserState = { email };
  const res = await authService.loginWithPasskey(email);
  if (res.ok) {
    return FlowUpdate.navigate(ScreenNames.End, userState);
  }

  if (res.val instanceof UnknownUserError) {
    return FlowUpdate.navigate(ScreenNames.Start, {
      ...userState,
      emailError: res.val,
    });
  }

  if (res.val instanceof NoPasskeyAvailableError) {
    return sendEmailOTP(authService, email);
  }

  if (res.val instanceof PasskeyChallengeCancelledError) {
    return sendEmailOTP(authService, email);
  }

  return FlowUpdate.navigate(ScreenNames.PasskeyError, userState);
};

export const loginWithEmailOTP = async (
  authService: AuthService,
  userState: UserState,
  otp?: string,
): Promise<Result<undefined, FlowUpdate>> => {
  if (!otp || otp.length !== 6) {
    return Err(FlowUpdate.state({ ...userState, emailOTPError: new InvalidOtpInputError() }));
  }

  const res = await authService.completeLoginWithEmailOTP(otp);
  if (res.ok) {
    return Ok(undefined);
  }

  if (res.val instanceof InvalidOtpInputError) {
    return Err(FlowUpdate.state({ ...userState, emailOTPError: res.val }));
  }

  return Err(FlowUpdate.state({ ...userState, emailOTPError: new UnknownError() }));
};

export const initConditionalUI = async (state: FlowHandlerState): Promise<FlowUpdate | undefined> => {
  if (!state.passkeysSupported) {
    // TODO: distinguish between an explicit and an implicit cancellation here
    return FlowUpdate.ignore();
  }

  const response = await state.corbadoApp.authService.loginWithConditionalUI();
  if (response.err) {
    // TODO: distinguish between an explicit and an implicit cancellation here
    return FlowUpdate.ignore();
  }

  return FlowUpdate.navigate(ScreenNames.End);
};

export const appendPasskey = async (authService: AuthService): Promise<FlowUpdate> => {
  await authService.appendPasskey();
  return FlowUpdate.navigate(ScreenNames.End);
};
