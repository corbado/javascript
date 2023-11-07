import type { ApiService } from "./ApiService";
export class AuthService {
  private _isAuthenticated = false;
  private _isEmailVerified = false;
  //private isPasskeySet = false;
  private emailCodeIdRef = "";

  constructor(private readonly _apiService: ApiService) {}

  // returns true if email is sent
  public async sendEmailWithOTP(email: string, username = "") {
    const resp = await this._apiService.usersApi.emailCodeRegisterStart({
      email: email,
      username: username,
    });

    this.emailCodeIdRef = resp.data.data.emailCodeID;

    return resp.status === 200;
  }

  // returns true if otp is verified
  public async verifyOTP(otp: string) {
    if (this.emailCodeIdRef === "") {
      throw new Error("Email code id is empty");
    }

    const verifyResp = await this._apiService.usersApi.emailCodeConfirm({
      code: otp,
      emailCodeID: this.emailCodeIdRef,
    });

    //const sessionData = verifyResp.data.data;
    this._isAuthenticated = true;
    this._isEmailVerified = true;

    return verifyResp.status === 200;
  }

  public get isAuthenticated() {
    return this._isAuthenticated;
  }

  public get isEmailVerified() {
    return this._isEmailVerified;
  }
}
