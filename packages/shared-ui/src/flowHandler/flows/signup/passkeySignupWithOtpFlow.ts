import { FlowHandlerEvents, FlowType, PasskeySignupWithEmailOtpFallbackScreens } from '../../constants';
import { FlowUpdate } from '../../flowUpdate';
import type { Flow } from '../../types';
import {
  appendPasskey,
  checkUserExists,
  createPasskey,
  sendEmailOTP,
  signupWithEmailOTP,
  validateEmailAndFullName,
  validateUserAuthState,
} from './utils';

export const PasskeySignupWithEmailOTPFallbackFlow: Flow = {
  [PasskeySignupWithEmailOtpFallbackScreens.Start]: async (state, event, eventOptions) => {
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

        return state.passkeysSupported
          ? FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyCreate, {
              ...eventOptions?.userStateUpdate,
            })
          : await sendEmailOTP(state.corbadoApp, email, fullName, true);
      }
    }

    return undefined;
  },

  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyCreate]: async (state, event) => {
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const { email, fullName } = validations.val;

    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits);
      case FlowHandlerEvents.PrimaryButton: {
        const res = await createPasskey(state.corbadoApp, email, fullName);
        if (res.ok) {
          return res.val;
        }

        if (state.flowOptions.retryPasskeyOnError) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyError);
        }

        return await sendEmailOTP(state.corbadoApp, email, fullName);
      }
      case FlowHandlerEvents.SecondaryButton: {
        return await sendEmailOTP(state.corbadoApp, email, fullName);
      }
    }

    return;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.EnterOtp]: async (state, event, eventOptions) => {
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
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
        }

        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.Start);
    }

    return;
  },
  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyAppend]: async (state, event) => {
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
          ? FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyError)
          : FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits);
    }

    return undefined;
  },

  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits]: async (state, event) => {
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const { email, fullName } = validations.val;

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        if (state.user) {
          const res = await appendPasskey(state.corbadoApp);

          return res.ok ? res.val : FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
        }

        const res = await createPasskey(state.corbadoApp, email, fullName);
        if (res.ok) {
          return res.val;
        }

        if (state.flowOptions.retryPasskeyOnError) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyError);
        }

        return await sendEmailOTP(state.corbadoApp, email, fullName);
      }
      case FlowHandlerEvents.SecondaryButton: {
        if (state.user) {
          return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
        }

        return await sendEmailOTP(state.corbadoApp, email, fullName);
      }
    }

    return;
  },

  [PasskeySignupWithEmailOtpFallbackScreens.PasskeySuccess]: (_, event): Promise<FlowUpdate | undefined> => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        return Promise.resolve(FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End));
    }

    return Promise.resolve(undefined);
  },

  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: async (state, event) => {
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const { email, fullName } = validations.val;

    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits);
      case FlowHandlerEvents.PrimaryButton: {
        const res = await createPasskey(state.corbadoApp, email, fullName);
        if (res.ok) {
          return res.val;
        }

        return;
      }
      case FlowHandlerEvents.SecondaryButton:
        return await sendEmailOTP(state.corbadoApp, email, fullName);
      case FlowHandlerEvents.CancelPasskey:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
    }

    return;
  },
};
