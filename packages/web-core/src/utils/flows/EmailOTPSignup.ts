//import type { ProjectConfigRspAllOfData } from "../../api";
import type { Flow } from "../../types";

export const EmailOTPSignupFlow: Flow = {
  start: () => "enter-otp",
  "enter-otp": () => "end",
};
