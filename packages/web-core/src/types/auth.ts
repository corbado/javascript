export enum AuthState {
  LoggedOut,
  LoggedIn,
}

export type AuthMethod = 'email' | 'phone_number' | 'webauthn' | 'password';

export interface UserAuthMethodsInterface {
  selectedMethods: Array<AuthMethod>;
  possibleMethods: Array<AuthMethod>;
}
