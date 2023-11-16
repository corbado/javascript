import { create, get } from "@github/webauthn-json";

import type { AuthMethod } from "../api";
import type { ApiService } from "./ApiService";

/**
 * AuthService is a class that handles authentication-related operations.
 * It manages the user's authentication state and provides methods for signing up, logging in, and managing authentication methods.
 */
export class AuthService {
  private _isAuthenticated = false;
  private _isEmailVerified = false;
  private _isPasskeySet = false;
  private _emailCodeIdRef = "";
  private _email = "";
  private _username = "";
  private _mediationController: AbortController | null = null;
  private _authMethod: Array<AuthMethod> = [];
  private _possibleAuthMethods: Array<AuthMethod> = [];
  private _onMediationSuccessCallbacks: Array<() => void> = [];
  private _onMediationFailureCallbacks: Array<() => void> = [];

  /**
   * The constructor initializes the AuthService with an instance of ApiService.
   */
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

  public get authMethod() {
    return this._authMethod;
  }

  public get possibleAuthMethods() {
    return this._possibleAuthMethods;
  }

  /**
   * Method to add a callback function to be called when mediation is successful.
   */
  public onMediationSuccess(callback: () => void) {
    this._onMediationSuccessCallbacks.push(callback);
  }

  /**
   * Method to add a callback function to be called when mediation fails.
   */
  public onMediationFailure(callback: () => void) {
    this._onMediationFailureCallbacks.push(callback);
  }

  /**
   * Method to initiate the signup process.
   */
  public initiateSignup(email: string, username = "") {
    this._email = email;
    this._username = username;
  }

  /**
   * Method to initiate the login process.
   * This method fetches the authentication methods for the user as well based on the given email/username.
   */
  public async initiateLogin(email: string) {
    this._email = email;

    const resp = await this._apiService.usersApi.authMethodsList({
      username: this._email,
    });

    this._authMethod = resp.data.data.selectedMethods;
    this._possibleAuthMethods = resp.data.data.possibleMethods;
  }

  /**
   * Method to start registration of a user by sending an email with an OTP.
   */
  public async sendEmailWithOTP() {
    const resp = await this._apiService.usersApi.emailCodeRegisterStart({
      email: this._email,
      username: this._username,
    });

    this._emailCodeIdRef = resp.data.data.emailCodeID;

    return resp.status === 200;
  }

  /**
   * Method to verify the OTP.
   * It also sets the session token in the ApiService instance.
   * This can be used to verify both registration and login OTPs.
   * @param otp The OTP to be verified
   */
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

  /**
   * Method to register a passkey.
   * This is used in passkey creation flow.
   */
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

  /**
   * Method to append a passkey.
   * User needs to be logged in to use this method.
   */
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

  /**
   * Method to login with a passkey.
   */
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

  /**
   * Method to mediate a passkey.
   * This is used in passkey mediation / conditional UI flow.
   */
  public async passkeyMediation(username?: string) {
    const controller = new AbortController();
    const signal = controller.signal;
    this._mediationController = controller;

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
    const successful = respFinish.status === 200;

    if (successful) {
      this._onMediationSuccessCallbacks.forEach((cb) => cb());
    } else {
      this._onMediationFailureCallbacks.forEach((cb) => cb());
    }

    return successful;
  }

  /**
   * Method to login with an email OTP.
   */
  public async emailOtpLogin() {
    const resp = await this._apiService.usersApi.emailCodeLoginStart({
      username: this._email,
    });

    this._emailCodeIdRef = resp.data.data.emailCodeID;

    return resp.status === 200;
  }

  /**
   * Method to destroy the AuthService.
   */
  public destroy() {
    if (!this._mediationController) {
      return;
    }

    try {
      this._mediationController.abort("User chose to cancel");
    } catch (e) {
      console.error(e);
    }
  }
}
