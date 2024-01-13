import { EmailOtpSignupWithPasskeyScreens, FlowHandlerEvents, FlowType } from '../../constants';
import { FlowUpdate } from '../../flowUpdate';
import type { Flow } from '../../types';
import {
  appendPasskey,
  checkUserExists,
  sendEmailOTP,
  signupWithEmailOTP,
  validateEmailAndFullName,
  validateUserAuthState,
} from './utils';

export const EmailOtpSignupWithPasskeyFlow: Flow = {
  [EmailOtpSignupWithPasskeyScreens.Start]: async (state, event, eventOptions) => {
    switch (event) {
      case FlowHandlerEvents.ChangeFlow:
        return FlowUpdate.changeFlow(FlowType.Login);
      case FlowHandlerEvents.PrimaryButton: {
        const validations = validateEmailAndFullName(eventOptions?.userStateUpdate, true);
        if (validations.err) {
          return validations.val;
        }
        const { email, fullName } = validations.val;

        const userExistsError = await checkUserExists(state.corbadoApp, email, fullName);
        if (userExistsError.err) {
          return userExistsError.val;
        }

        return await sendEmailOTP(state.corbadoApp, email, fullName, true);
      }
    }

    return undefined;
  },

  [EmailOtpSignupWithPasskeyScreens.EnterOtp]: async (state, event, eventOptions) => {
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        const res = await signupWithEmailOTP(state.corbadoApp, state.userState, eventOptions?.emailOTPCode);
        if (res.err) {
          return res.val;
        }

        if (!state.flowOptions.passkeyAppend || !state.passkeysSupported) {
          return FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.End);
        }

        return FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.PasskeyAppend);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.Start);
    }

    return;
  },

  [EmailOtpSignupWithPasskeyScreens.PasskeyAppend]: async (state, event) => {
    const validations = validateUserAuthState(state);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        const res = await appendPasskey(state.corbadoApp);
        if (res.ok) {
          return res.val;
        }

        return state.flowOptions.retryPasskeyOnError
          ? FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.PasskeyError)
          : FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.End);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.End);
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.PasskeyBenefits);
    }

    return undefined;
  },

  [EmailOtpSignupWithPasskeyScreens.PasskeyBenefits]: async (state, event) => {
    const validations = validateUserAuthState(state);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        const res = await appendPasskey(state.corbadoApp);
        if (res.ok) {
          return res.val;
        }

        return state.flowOptions.retryPasskeyOnError
          ? FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.PasskeyError)
          : FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.End);
      }
      case FlowHandlerEvents.SecondaryButton: {
        return FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.End);
      }
    }

    return;
  },

  [EmailOtpSignupWithPasskeyScreens.PasskeySuccess]: (_, event): Promise<FlowUpdate | undefined> => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        return Promise.resolve(FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.End));
    }

    return Promise.resolve(undefined);
  },

  [EmailOtpSignupWithPasskeyScreens.PasskeyError]: async (state, event) => {
    const validations = validateUserAuthState(state);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.PasskeyBenefits);
      case FlowHandlerEvents.PrimaryButton: {
        const res = await appendPasskey(state.corbadoApp);
        if (res.ok) {
          return res.val;
        }

        return;
      }
      case FlowHandlerEvents.CancelPasskey:
        return FlowUpdate.navigate(EmailOtpSignupWithPasskeyScreens.End);
    }

    return;
  },
};
