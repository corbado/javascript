import { InvalidEmailError, InvalidOtpInputError, UnknownError } from '@corbado/web-core';

import { FlowHandlerEvents, FlowType, PasskeyLoginWithEmailOtpFallbackScreens } from '../../constants';
import { FlowUpdate } from '../../flowUpdate';
import type { Flow } from '../../types';
import { initPasskeyAppend, loginWithPasskey, sendEmailOTP } from './utils';

export const PasskeyLoginWithEmailOTPFallbackFlow: Flow = {
  [PasskeyLoginWithEmailOtpFallbackScreens.Start]: async (state, event, eventOptions) => {
    switch (event) {
      case FlowHandlerEvents.ChangeFlow:
        return FlowUpdate.changeFlow(FlowType.SignUp);
      case FlowHandlerEvents.PrimaryButton: {
        if (!eventOptions?.userStateUpdate?.email) {
          return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.Start, {
            emailError: new InvalidEmailError(),
          });
        }

        if (!state.passkeysSupported) {
          return await sendEmailOTP(state.corbadoApp.authService, eventOptions?.userStateUpdate?.email);
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
  [PasskeyLoginWithEmailOtpFallbackScreens.PasskeyAppend]: async (state, event): Promise<FlowUpdate | undefined> => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        await state.corbadoApp.authService.appendPasskey();

        return FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End);
      case FlowHandlerEvents.SecondaryButton:
        return Promise.resolve(FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.End));
      case FlowHandlerEvents.ShowBenefits:
        return Promise.resolve(FlowUpdate.navigate(PasskeyLoginWithEmailOtpFallbackScreens.PasskeyBenefits));
    }

    return Promise.resolve(undefined);
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
        return sendEmailOTP(state.corbadoApp.authService, state?.userState.email);
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
