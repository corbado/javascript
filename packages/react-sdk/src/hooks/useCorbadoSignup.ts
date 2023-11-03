import { useAppContext } from "./useAppContext";

export const useCorbadoSignUp = () => {
  const { apiService } = useAppContext();
  const sendEmailWithOTP = async (email: string, username = "") => {
    const codeResp = await apiService.usersApi.emailCodeRegisterStart({
      email: email,
      username: username,
    });

    console.log("Code Resp: ", codeResp);
    return codeResp;
  };

  const verifyOTP = async (otp: string) => {
    const verifyResp = await apiService.usersApi.emailCodeConfirm({
      code: otp,
      emailCodeID: "string",
    });

    console.log("Verify Resp: ", verifyResp);
    return verifyResp;
  };

  return {
    sendEmailWithOTP,
    verifyOTP,
  };
};
