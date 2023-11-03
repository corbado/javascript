import type { EmailCodeRegisterStartRspAllOfData } from "@corbado/web-core";
import { useState } from "react";

import { useAppContext } from "./useAppContext";

export const useCorbadoSignUp = () => {
  const { apiService } = useAppContext();
  const [emailCodeId, setEmailCodeId] = useState<string>("");

  const sendEmailWithOTP = async (email: string, username = "") => {
    const codeResp = await apiService.usersApi.emailCodeRegisterStart({
      email: email,
      username: username,
    });

    const id = // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((codeResp.data as any).data as EmailCodeRegisterStartRspAllOfData)
        .emailCodeID;
    setEmailCodeId(id);
    return codeResp;
  };

  const verifyOTP = async (otp: string) => {
    const verifyResp = await apiService.usersApi.emailCodeConfirm({
      code: otp,
      emailCodeID: emailCodeId,
    });

    return verifyResp;
  };

  return {
    sendEmailWithOTP,
    verifyOTP,
  };
};
