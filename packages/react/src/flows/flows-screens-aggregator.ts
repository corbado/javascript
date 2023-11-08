import type { FlowNames } from "@corbado/web-core";
import { SignUpFlowNames } from "@corbado/web-core";

import type {SignupWithEmailOTPScreens } from "./SignupWithEmailOtpFlow";
import { SignupWithEmailOtpFlow } from "./SignupWithEmailOtpFlow";

type FlowScreens = SignupWithEmailOTPScreens // Append other flow screens to this type.

type Flows = {
    [key in FlowNames]?: FlowScreens;
};

export const flows: Flows = {
    [SignUpFlowNames.EmailOTPSignup]: SignupWithEmailOtpFlow
}