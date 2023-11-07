//import type { ProjectConfigRspAllOfData } from "../../api";
import { EmailOtpSignupScreens, type Flow } from "../../types";

export const EmailOTPSignupFlow: Flow = {
  [EmailOtpSignupScreens.Start]: () => EmailOtpSignupScreens.EnterOtp,
  [EmailOtpSignupScreens.EnterOtp]: () => EmailOtpSignupScreens.End,
};
