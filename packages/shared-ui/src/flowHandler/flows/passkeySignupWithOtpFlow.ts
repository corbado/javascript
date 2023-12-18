import type { AuthService, SignUpWithPasskeyError } from '@corbado/web-core';
import {
  InvalidEmailError,
  InvalidFullnameError,
  InvalidOtpInputError,
  UnknownError,
  UserAlreadyExistsError,
} from '@corbado/web-core';
import type { Result } from 'ts-results';
import { Ok } from 'ts-results';

import { FlowHandlerEvents, FlowType, PasskeySignupWithEmailOtpFallbackScreens } from '../constants';
import type { FlowHandlerState } from '../flowHandlerState';
import { FlowUpdate } from '../flowUpdate';
import type { Flow } from '../types';

const sendEmailOTP = async (
  authService: AuthService,
  email: string,
  fullName?: string,
): Promise<FlowUpdate | undefined> => {
  const res = await authService.initSignUpWithEmailOTP(email, fullName ?? '');

  if (res.ok) {
    return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.EnterOtp, {
      emailOTPState: { lastMailSent: new Date() },
    });
  }

  return;
};

const createPasskey = async (
  state: FlowHandlerState,
): Promise<Result<FlowUpdate, SignUpWithPasskeyError | undefined>> => {
  if (!state.userState.email) {
    return Ok(
      FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start, {
        emailError: new InvalidEmailError(),
      }),
    );
  }

  const res: Result<void, SignUpWithPasskeyError | undefined> = await state.corbadoApp.authService.signUpWithPasskey(
    state.userState.email,
    state.userState.fullName ?? '',
  );
  if (res.ok) {
    return Ok(FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome));
  }

  return res;
};

export const PasskeySignupWithEmailOTPFallbackFlow: Flow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: async (state, event, eventOptions) => {
    switch (event) {
      case FlowHandlerEvents.ChangeFlow:
        return FlowUpdate.changeFlow(FlowType.Login);
      case FlowHandlerEvents.PrimaryButton: {
        if (!eventOptions?.userStateUpdate?.fullName) {
          return FlowUpdate.state({ userNameError: new InvalidFullnameError(), ...eventOptions?.userStateUpdate });
        }

        if (!eventOptions?.userStateUpdate?.email) {
          return FlowUpdate.state({ emailError: new InvalidEmailError(), ...eventOptions?.userStateUpdate });
        }

        const nextScreen = state.passkeysSupported
          ? PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey
          : PasskeySignupWithEmailOtpFallbackScreens.EnterOtp;

        const res = await state.corbadoApp.authService.userExists(eventOptions?.userStateUpdate?.email);
        if (res.err) {
          return FlowUpdate.state({ emailError: new UnknownError(), ...eventOptions?.userStateUpdate });
        }

        const userAlreadyExists = res.val;
        if (userAlreadyExists == null) {
          return;
        }

        if (userAlreadyExists) {
          return FlowUpdate.state({
            ...eventOptions?.userStateUpdate,
            emailError: new UserAlreadyExistsError(),
          });
        }

        return FlowUpdate.navigate(nextScreen, {
          ...eventOptions?.userStateUpdate,
        });
      }
    }

    return undefined;
  },

  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: async (state, event) => {
    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits);
      case FlowHandlerEvents.SecondaryButton: {
        if (!state.userState.email) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start, {
            emailError: new InvalidEmailError(),
          });
        }

        return sendEmailOTP(state.corbadoApp.authService, state.userState.email, state.userState.fullName);
      }
      case FlowHandlerEvents.PrimaryButton: {
        if (!state.userState.email) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start, {
            emailError: new InvalidEmailError(),
          });
        }

        const res: Result<void, SignUpWithPasskeyError | undefined> =
          await state.corbadoApp.authService.signUpWithPasskey(state.userState.email, state.userState.fullName ?? '');
        if (res.ok) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome);
        }

        if (state.flowOptions.retryPasskeyOnError) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyError);
        }

        return sendEmailOTP(state.corbadoApp.authService, state.userState.email, state.userState.fullName);
      }
    }

    return;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: async (state, event, eventOptions) => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        if (!eventOptions?.emailOTPCode) {
          return FlowUpdate.state({ emailOTPError: new InvalidOtpInputError() });
        }

        const res = await state.corbadoApp.authService.completeSignupWithEmailOTP(eventOptions?.emailOTPCode);
        if (res.err) {
          if (res.val instanceof InvalidOtpInputError) {
            return FlowUpdate.state({ emailOTPError: res.val });
          }

          return FlowUpdate.state({ emailOTPError: new UnknownError() });
        }

        if (!state.flowOptions.passkeyAppend) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
        }

        return state.passkeysSupported
          ? FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend)
          : FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start);
    }

    return;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend]: async (state, event) => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        const res = await state.corbadoApp.authService.appendPasskey();
        if (res.err) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyError);
        }

        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome);
      }
      case FlowHandlerEvents.SecondaryButton:
        if (state.user) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
        }

        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.EnterOtp);
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits);
    }

    return undefined;
  },

  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: async (state, event) => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        const res = await createPasskey(state);
        if (res.ok) {
          return res.val;
        }

        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyError);
      }
      case FlowHandlerEvents.SecondaryButton:
        if (state.user) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
        }

        if (!state.userState.email) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start, {
            emailError: new InvalidEmailError(),
          });
        }

        return sendEmailOTP(state.corbadoApp.authService, state.userState.email, state.userState.fullName);
    }

    return;
  },

  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: async (_, event) => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
    }

    return;
  },

  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: async (state, event) => {
    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits);
      case FlowHandlerEvents.PrimaryButton: {
        const res = await createPasskey(state);
        if (res.ok) {
          return res.val;
        }

        return;
      }
      case FlowHandlerEvents.SecondaryButton:
        if (state.user) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
        } else {
          if (!state.userState.email) {
            return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start, {
              emailError: new InvalidEmailError(),
            });
          }

          return sendEmailOTP(state.corbadoApp.authService, state.userState.email, state.userState.fullName);
        }
    }

    return;
  },
};
