import { create, get } from "@github/webauthn-json";

import type { ApiService } from "./ApiService";
export class AuthService {
  private _isAuthenticated = false;
  private _isEmailVerified = false;
  private _isPasskeySet = false;
  private _emailCodeIdRef = "";
  private _email = "";
  private _username = "";

  constructor(private readonly _apiService: ApiService) {}

  public get isAuthenticated() {
    return this._isAuthenticated;
  }

  public get isEmailVerified() {
    return this._isEmailVerified;
  }

  public get isPasskeySet() {
    return this._isPasskeySet;
  }

  public get email() {
    return this._email;
  }

  public get username() {
    return this._username;
  }

  public initiateAuth(email: string, username = "") {
    this._email = email;
    this._username = username;
  }

  // returns true if email is sent
  public async sendEmailWithOTP(email: string, username = "") {
    this.initiateAuth(email, username);

    const resp = await this._apiService.usersApi.emailCodeRegisterStart({
      email: email,
      username: username,
    });

    this._emailCodeIdRef = resp.data.data.emailCodeID;

    return resp.status === 200;
  }

  // returns true if otp is verified
  public async verifyOTP(otp: string) {
    if (this._emailCodeIdRef === "") {
      throw new Error("Email code id is empty");
    }

    const verifyResp = await this._apiService.usersApi.emailCodeConfirm({
      code: otp,
      emailCodeID: this._emailCodeIdRef,
    });

    //const sessionData = verifyResp.data.data;
    this._apiService.setInstanceWithToken(
      verifyResp.data.data.sessionToken ?? ""
    );
    this._isAuthenticated = true;
    this._isEmailVerified = true;

    return verifyResp.status === 200;
  }

  public async passkeyRegister() {
    const respStart = await this._apiService.usersApi.passKeyRegisterStart({
      username: this._email,
      fullName: this._username,
    });
    const challenge = JSON.parse(respStart.data.data.challenge);
    const signedChallenge = await create(challenge);
    const respFinish = await this._apiService.usersApi.passKeyRegisterFinish({
      signedChallenge: JSON.stringify(signedChallenge),
    });

    //const sessionData = respFinish.data.data;
    this._apiService.setInstanceWithToken(
      respFinish.data.data.sessionToken ?? ""
    );

    this._isPasskeySet = true;
    this._isAuthenticated = true;

    return respFinish.status === 200;
  }

  public async passkeyAppend() {
    const respStart = await this._apiService.usersApi.passKeyAppendStart({});
    const challenge = JSON.parse(respStart.data.data.challenge);
    const signedChallenge = await create(challenge);
    const respFinish = await this._apiService.usersApi.passKeyAppendFinish({
      signedChallenge: JSON.stringify(signedChallenge),
    });

    //const sessionData = respFinish.data.data;

    this._isPasskeySet = true;

    return respFinish.status === 200;
  }

  public async passkeyLogin() {
    const respStart = await this._apiService.usersApi.passKeyLoginStart({
      username: this._email,
    });
    const challenge = JSON.parse(respStart.data.data.challenge);
    const signedChallenge = await get(challenge);
    const respFinish = await this._apiService.usersApi.passKeyLoginFinish({
      signedChallenge: JSON.stringify(signedChallenge),
    });

    const sessionData = respFinish.data.data;
    this._apiService.setInstanceWithToken(sessionData.sessionToken ?? "");

    this._isAuthenticated = true;

    return respFinish.status === 200;
  }

  public async passkeyMediation(username?: string) {
    const controller = new AbortController();
    const signal = controller.signal;
    const respStart = await this._apiService.usersApi.passKeyMediationStart(
      username ? { username } : {}
    );
    const challenge = JSON.parse(respStart.data.data.challenge);
    challenge.mediation = "conditional";
    challenge.signal = signal;

    const signedChallenge = await get(challenge);
    const respFinish = await this._apiService.usersApi.passKeyLoginFinish({
      signedChallenge: JSON.stringify(signedChallenge),
    });

    //const sessionData = respFinish.data.data;

    this._isAuthenticated = true;

    return respFinish.status === 200;
  }

  public async emailOtpLogin() {
    const resp = await this._apiService.usersApi.emailCodeLoginStart({
      username: this._email,
    });

    this._emailCodeIdRef = resp.data.data.emailCodeID;

    return resp.status === 200;
  }
}
