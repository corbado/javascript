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
        const validations = validateEmailAndFullName(
          eventOptions?.userStateUpdate?.email,
          eventOptions?.userStateUpdate?.fullName,
          true,
        );
        if (validations.err) {
          return validations.val;
        }
        const { email, fullName } = validations.val;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const userExistsError = await checkUserExists(state.corbadoApp, email, eventOptions!.userStateUpdate!);
        if (userExistsError.err) {
          return userExistsError.val;
        }

        return state.passkeysSupported
          ? FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey, {
              ...eventOptions?.userStateUpdate,
            })
          : await sendEmailOTP(state.corbadoApp, email, fullName, true);
      }
    }

    return undefined;
  },

  [PasskeySignupWithEmailOtpFallbackScreens.CreatePasskey]: async (state, event) => {
    const validations = validateEmailAndFullName(state.userState.email, state.userState.fullName);
    if (validations.err) {
      return validations.val;
    }
    const { email, fullName } = validations.val;

    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.PasskeyBenefits);
      case FlowHandlerEvents.PrimaryButton: {
        const res = await createPasskey(state);
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
    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        const error = await signupWithEmailOTP(state.corbadoApp, eventOptions?.emailOTPCode);
        if (error) {
          return error;
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
        const res = await appendPasskey(state);
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
    const validations = validateEmailAndFullName(state.userState.email, state.userState.fullName);
    if (validations.err) {
      return validations.val;
    }
    const { email, fullName } = validations.val;

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        if (state.user) {
          const res = await appendPasskey(state);

          return res.ok ? res.val : FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End);
        }

        const res = await createPasskey(state);
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

  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyWelcome]: (_, event): Promise<FlowUpdate | undefined> => {
    switch (event) {
      case FlowHandlerEvents.PrimaryButton:
        return Promise.resolve(FlowUpdate.navigate(PasskeySignupWithEmailOtpFallbackScreens.End));
    }

    return Promise.resolve(undefined);
  },

  [PasskeySignupWithEmailOtpFallbackScreens.PasskeyError]: async (state, event) => {
    const validations = validateEmailAndFullName(state.userState.email, state.userState.fullName);
    if (validations.err) {
      return validations.val;
    }
    const { email, fullName } = validations.val;

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
        return await sendEmailOTP(state.corbadoApp, email, fullName);
    }

    return;
  },
};
