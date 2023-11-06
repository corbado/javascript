import type {
  EmailCodeConfirmRsp,
  EmailCodeRegisterStartRspAllOfData,
} from "../api";
import type { ApiService } from "./ApiService";
export class AuthService {
  private _isAuthenticated = false;
  private _isEmailVerified = false;
  //private isPasskeySet = false;
  private emailCodeIdRef = "";

  constructor(private readonly _apiService: ApiService) {}

  public async sendEmailWithOTP(email: string, username = "") {
    const resp = await this._apiService.usersApi.emailCodeRegisterStart({
      email: email,
      username: username,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (resp.data as any).data as EmailCodeRegisterStartRspAllOfData;

    this.emailCodeIdRef = data.emailCodeID;

    return data;
  }

  public async verifyOTP(otp: string) {
    if (this.emailCodeIdRef === "") {
      throw new Error("Email code id is empty");
    }

    const verifyResp = await this._apiService.usersApi.emailCodeConfirm({
      code: otp,
      emailCodeID: this.emailCodeIdRef,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = verifyResp.data as any as EmailCodeConfirmRsp;
    this._isAuthenticated = true;
    this._isEmailVerified = true;

    return data;
  }

  public get isAuthenticated() {
    return this._isAuthenticated;
  }

  public get isEmailVerified() {
    return this._isEmailVerified;
  }
}
