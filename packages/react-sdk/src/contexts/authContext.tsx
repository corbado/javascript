import type {
  EmailCodeConfirmRsp,
  EmailCodeRegisterStartRspAllOfData,
} from "@corbado/web-core";
import React, { createContext, useRef } from "react";

import { useAppContext } from "../hooks/useAppContext";

export interface IAuthContextType {
  sendEmailWithOTP: (
    email: string,
    username?: string
  ) => Promise<EmailCodeRegisterStartRspAllOfData>;
  verifyOTP: (otp: string) => Promise<EmailCodeConfirmRsp>;
}

// export interface IAuthContextProviderParams {
// }

export const AuthContext = createContext<IAuthContextType | null>(null);

export const AuthContextProvider: React.FC = ({ children }) => {
  const { apiService } = useAppContext();
  const emailCodeIdRef = useRef<string>("");

  const sendEmailWithOTP = async (email: string, username = "") => {
    const codeResp = await apiService.usersApi.emailCodeRegisterStart({
      email: email,
      username: username,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (codeResp.data as any)
      .data as EmailCodeRegisterStartRspAllOfData;

    const id = data.emailCodeID;
    emailCodeIdRef.current = id;

    return data;
  };

  const verifyOTP = async (otp: string) => {
    const verifyResp = await apiService.usersApi.emailCodeConfirm({
      code: otp,
      emailCodeID: emailCodeIdRef.current,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = verifyResp.data as any as EmailCodeConfirmRsp;

    return data;
  };

  return (
    <AuthContext.Provider value={{ sendEmailWithOTP, verifyOTP }}>
      {children}
    </AuthContext.Provider>
  );
};
