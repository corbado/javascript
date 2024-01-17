import { FlowHandlerEvents, FlowType, ScreenNames } from '../../constants';
import { FlowUpdate } from '../../flowUpdate';
import type { Flow } from '../../types';
import {
  appendPasskey,
  checkUserExists,
  initSignupWithVerificationMethod,
  signupWithEmailLink,
  signupWithEmailOTP,
  validateEmailAndFullName,
  validateUserAuthState,
} from './utils';

export const VerificationMethodSignupWithPasskeyFlow: Flow = {
  [ScreenNames.Start]: async (state, event, eventOptions) => {
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

        return await initSignupWithVerificationMethod(state.corbadoApp, state.flowOptions, email, fullName, true);
      }
    }

    return undefined;
  },

  [ScreenNames.EnterOTP]: async (state, event, eventOptions) => {
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        const res = await signupWithEmailOTP(state.corbadoApp, state.userState, eventOptions?.verificationCode);
        if (res.err) {
          return res.val;
        }

        if (!state.flowOptions.passkeyAppend || !state.passkeysSupported) {
          return FlowUpdate.navigate(ScreenNames.End);
        }

        return FlowUpdate.navigate(ScreenNames.PasskeyAppend);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(ScreenNames.Start);
    }

    return;
  },

  [ScreenNames.EmailLinkSent]: (state, event) => {
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        // resend email
        return;
      }
      case FlowHandlerEvents.CancelEmailLink:
        return FlowUpdate.navigate(ScreenNames.Start);
    }

    return;
  },

  [ScreenNames.EmailLinkVerification]: async (state, event) => {
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.VerifyLink: {
        const res = await signupWithEmailLink(state.corbadoApp, state.userState);
        if (res.err) {
          return res.val;
        }

        if (!state.flowOptions.passkeyAppend || !state.passkeysSupported) {
          return FlowUpdate.navigate(ScreenNames.End);
        }

        return FlowUpdate.navigate(ScreenNames.PasskeyAppend);
      }
      case FlowHandlerEvents.CancelEmailLink:
        return FlowUpdate.navigate(ScreenNames.Start);
    }

    return;
  },

  [ScreenNames.PasskeyAppend]: async (state, event) => {
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
          ? FlowUpdate.navigate(ScreenNames.PasskeyError)
          : FlowUpdate.navigate(ScreenNames.End);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(ScreenNames.End);
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(ScreenNames.PasskeyBenefits);
    }

    return undefined;
  },

  [ScreenNames.PasskeyBenefits]: async (state, event) => {
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
          ? FlowUpdate.navigate(ScreenNames.PasskeyError)
          : FlowUpdate.navigate(ScreenNames.End);
      }
      case FlowHandlerEvents.SecondaryButton: {
        return FlowUpdate.navigate(ScreenNames.End);
      }
    }

    return;
  },

  [ScreenNames.PasskeySuccess]: (_, event): Promise<FlowUpdate | undefined> => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        return Promise.resolve(FlowUpdate.navigate(ScreenNames.End));
    }

    return Promise.resolve(undefined);
  },

  [ScreenNames.PasskeyError]: async (state, event) => {
    const validations = validateUserAuthState(state);
    if (validations.err) {
      return validations.val;
    }

    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(ScreenNames.PasskeyBenefits);
      case FlowHandlerEvents.PrimaryButton: {
        const res = await appendPasskey(state.corbadoApp);
        if (res.ok) {
          return res.val;
        }

        return;
      }
      case FlowHandlerEvents.CancelPasskey:
        return FlowUpdate.navigate(ScreenNames.End);
    }

    return;
  },
};
