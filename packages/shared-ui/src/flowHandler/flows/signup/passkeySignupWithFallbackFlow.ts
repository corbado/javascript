import { FlowHandlerEvents, FlowType, ScreenNames } from '../../constants';
import { FlowUpdate } from '../../flowUpdate';
import type { Flow } from '../../types';
import {
  appendPasskey,
  checkUserExists,
  createPasskey,
  initPasskeyAppend,
  initSignupWithVerificationMethod,
  sendEmailLinkAgain,
  signupWithEmailOTP,
  validateEmailAndFullName,
  validateUserAuthState,
} from './utils';

export const PasskeySignupWithFallbackFlow: Flow = {
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

        return state.passkeysSupported
          ? FlowUpdate.navigate(ScreenNames.PasskeyCreate, {
              ...eventOptions?.userStateUpdate,
            })
          : await initSignupWithVerificationMethod(state.corbadoApp, state.flowOptions, email, fullName, true);
      }
    }

    return undefined;
  },

  [ScreenNames.PasskeyCreate]: async (state, event) => {
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const { email, fullName } = validations.val;

    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(ScreenNames.PasskeyBenefits);
      case FlowHandlerEvents.PrimaryButton: {
        const res = await createPasskey(state.corbadoApp, email, fullName);
        if (res.ok) {
          return res.val;
        }

        // for now, as passkey operations are not repeatable in signUp we directly go to fallback
        // if (state.flowOptions.retryPasskeyOnError) {
        //   return FlowUpdate.navigate(ScreenNames.PasskeyError);
        // }

        return await initSignupWithVerificationMethod(state.corbadoApp, state.flowOptions, email, fullName);
      }
      case FlowHandlerEvents.SecondaryButton: {
        return await initSignupWithVerificationMethod(state.corbadoApp, state.flowOptions, email, fullName);
      }
    }

    return;
  },

  [ScreenNames.EmailOTPVerification]: async (state, event, eventOptions) => {
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

        return initPasskeyAppend(state.shouldAppendPasskey);
      }
      case FlowHandlerEvents.SecondaryButton: {
        // TODO: add OTP resend
        return undefined;
      }
      case FlowHandlerEvents.CancelOTP:
        return FlowUpdate.navigate(ScreenNames.Start);
    }

    return;
  },

  [ScreenNames.EmailLinkSent]: (state, event) => {
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const { email, fullName } = validations.val;

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        return sendEmailLinkAgain(state.corbadoApp, email, fullName);
      }
      case FlowHandlerEvents.CancelEmailLink:
        return FlowUpdate.navigate(ScreenNames.Start);
    }

    return;
  },

  [ScreenNames.EmailLinkVerification]: () => {
    // We don't need to do anything here, the user will be redirected to the login flow for email link verification
    return FlowUpdate.state({});
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

        // for now, as passkey operations are not repeatable in signUp we directly go to the end and not offer a retry
        // return state.flowOptions.retryPasskeyOnError
        //   ? FlowUpdate.navigate(ScreenNames.PasskeyError)
        //   : FlowUpdate.navigate(ScreenNames.End);
        return FlowUpdate.navigate(ScreenNames.End);
      }
      case FlowHandlerEvents.SecondaryButton:
        return FlowUpdate.navigate(ScreenNames.End);
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(ScreenNames.PasskeyBenefits);
    }

    return undefined;
  },

  [ScreenNames.PasskeyBenefits]: async (state, event) => {
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const { email, fullName } = validations.val;

    switch (event) {
      case FlowHandlerEvents.PrimaryButton: {
        if (state.user) {
          const res = await appendPasskey(state.corbadoApp);

          return res.ok ? res.val : FlowUpdate.navigate(ScreenNames.End);
        }

        const res = await createPasskey(state.corbadoApp, email, fullName);
        if (res.ok) {
          return res.val;
        }

        // for now, as passkey operations are not repeatable in signUp we directly go to fallback
        // if (state.flowOptions.retryPasskeyOnError) {
        //   return FlowUpdate.navigate(ScreenNames.PasskeyError);
        // }

        return await initSignupWithVerificationMethod(state.corbadoApp, state.flowOptions, email, fullName);
      }
      case FlowHandlerEvents.SecondaryButton: {
        if (state.user) {
          return FlowUpdate.navigate(ScreenNames.End);
        }

        return await initSignupWithVerificationMethod(state.corbadoApp, state.flowOptions, email, fullName);
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
    const validations = validateEmailAndFullName(state.userState);
    if (validations.err) {
      return validations.val;
    }
    const { email, fullName } = validations.val;

    switch (event) {
      case FlowHandlerEvents.ShowBenefits:
        return FlowUpdate.navigate(ScreenNames.PasskeyBenefits);
      case FlowHandlerEvents.PrimaryButton: {
        const res = await createPasskey(state.corbadoApp, email, fullName);
        if (res.ok) {
          return res.val;
        }

        return;
      }
      case FlowHandlerEvents.SecondaryButton:
        return await initSignupWithVerificationMethod(state.corbadoApp, state.flowOptions, email, fullName);
      case FlowHandlerEvents.CancelPasskey:
        return FlowUpdate.navigate(ScreenNames.End);
    }

    return;
  },
};
