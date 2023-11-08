import type { FlowNames, ScreenNames } from "@corbado/web-core";
import { SignUpFlowNames } from "@corbado/web-core";
import type React from "react";

import { SignupWithEmailOtpFlow } from "./SignupWithEmailOtpFlow";

type Screen = Record<ScreenNames, React.ReactNode>;

type Flow = Record<FlowNames, Screen>

export const flows: Flow = {
    [SignUpFlowNames.EmailOTPSignup]: SignupWithEmailOtpFlow
}