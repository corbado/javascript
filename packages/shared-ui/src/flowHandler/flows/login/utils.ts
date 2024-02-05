import type { AuthService } from '@corbado/web-core';
import { ConditionalUiUnconfirmedCredential } from '@corbado/web-core';
import { InvalidPasskeyError } from '@corbado/web-core';
import {
  InvalidEmailError,
  InvalidOtpInputError,
  InvalidTokenInputError,
  NoPasskeyAvailableError,
  PasskeyChallengeCancelledError,
  UnknownError,
  UnknownUserError,
} from '@corbado/web-core';
import { Err, Ok, type Result } from 'ts-results';

import { passkeyAppendAskTSKey, ScreenNames } from '../../constants';
import type { FlowHandlerState } from '../../flowHandlerState';
import { FlowUpdate } from '../../flowUpdate';
import type { FlowOptions, UserState } from '../../types';

/********** Validation Utils *********/

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

/********** Validation Utils *********/

const sendEmailOTP = async (authService: AuthService, email: string): Promise<FlowUpdate> => {
  const res = await authService.initLoginWithEmailOTP(email);

  if (res.ok) {
    return FlowUpdate.navigate(ScreenNames.EmailOTPVerification, {
      email,
    });
  }

  return FlowUpdate.state({ emailError: res.val, email });
};

const sendEmailLink = async (authService: AuthService, email: string): Promise<FlowUpdate> => {
  const res = await authService.initLoginWithEmailLink(email);

  if (res.ok) {
    return FlowUpdate.navigate(ScreenNames.EmailLinkSent, {
      email,
    });
  }

  return FlowUpdate.state({ emailError: res.val, email });
};

export const sendEmailLinkAgain = async (authService: AuthService, email: string): Promise<FlowUpdate> => {
  const res = await sendEmailLink(authService, email);

  return res ?? FlowUpdate.navigate(ScreenNames.EmailLinkSent, { emailError: new UnknownError(), email });
};

export const initLoginWithVerificationMethod = async (
  authService: AuthService,
  flowOptions: FlowOptions,
  email: string,
): Promise<FlowUpdate> => {
  return flowOptions.verificationMethod === 'emailLink'
    ? await sendEmailLink(authService, email)
    : await sendEmailOTP(authService, email);
};

export const loginWithEmailOTP = async (
  authService: AuthService,
  userState: UserState,
  otp?: string,
): Promise<Result<undefined, FlowUpdate>> => {
  if (!otp || otp.length !== 6) {
    return Err(FlowUpdate.state({ ...userState, verificationError: new InvalidOtpInputError() }));
  }

  const res = await authService.completeLoginWithEmailOTP(otp);
  if (res.ok) {
    return Ok(undefined);
  }

  if (res.val instanceof InvalidOtpInputError) {
    return Err(FlowUpdate.state({ ...userState, verificationError: res.val }));
  }

  return Err(FlowUpdate.state({ ...userState, verificationError: new UnknownError() }));
};

export const loginWithEmailLink = async (
  authService: AuthService,
  userState: UserState,
): Promise<Result<undefined, FlowUpdate>> => {
  const res = await authService.completeLoginWithEmailLink();

  const updatedURL = window.location.origin + window.location.pathname;
  history.pushState({}, '', updatedURL);

  if (res.ok) {
    return Ok(undefined);
  }

  if (res.val instanceof InvalidTokenInputError) {
    return Err(FlowUpdate.state({ ...userState, verificationError: res.val }));
  }

  return Err(FlowUpdate.state({ ...userState, verificationError: new UnknownError() }));
};

/********** Passkey Utils *********/

export const initPasskeyAppend = async (state: FlowHandlerState, email: string): Promise<FlowUpdate | undefined> => {
  if (!state.shouldAppendPasskey) {
    return FlowUpdate.navigate(ScreenNames.End);
  }

  const authMethods = await state.corbadoApp.authService.authMethods(email);
  if (authMethods.err) {
    // TODO: non recoverable error
    return;
  }

  const userHasPasskey = authMethods.val.selectedMethods.includes('webauthn');
  if (!userHasPasskey) {
    localStorage.setItem(passkeyAppendAskTSKey, Date.now().toString());
    return FlowUpdate.navigate(ScreenNames.PasskeyAppend, { email });
  }

  return FlowUpdate.navigate(ScreenNames.End, { email });
};

export const loginWithPasskey = async (
  authService: AuthService,
  flowOptions: FlowOptions,
  email: string,
): Promise<FlowUpdate | undefined> => {
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

  if (res.val instanceof NoPasskeyAvailableError || res.val instanceof PasskeyChallengeCancelledError) {
    return initLoginWithVerificationMethod(authService, flowOptions, email);
  }

  return FlowUpdate.navigate(ScreenNames.PasskeyError, userState);
};

export const initConditionalUI = async (state: FlowHandlerState): Promise<FlowUpdate | undefined> => {
  if (!state.passkeysSupported) {
    return FlowUpdate.ignore();
  }

  const response = await state.corbadoApp.authService.loginWithConditionalUI();
  if (response.ok) {
    return FlowUpdate.navigate(ScreenNames.End);
  }

  if (response.val instanceof PasskeyChallengeCancelledError) {
    return FlowUpdate.ignore();
  }

  if (response.val instanceof InvalidPasskeyError || response.val instanceof ConditionalUiUnconfirmedCredential) {
    return FlowUpdate.state({ emailError: response.val });
  }

  return FlowUpdate.ignore();
};

export const appendPasskey = async (authService: AuthService): Promise<FlowUpdate> => {
  await authService.appendPasskey();

  return FlowUpdate.navigate(ScreenNames.End);
};
