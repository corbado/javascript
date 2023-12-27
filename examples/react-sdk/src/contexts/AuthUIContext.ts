import { createContext } from 'react';

export enum AuthScreenNames {
  Login,
  InitiateSignUp,
  SelectSignUpMethod,
  CompleteEmailOTP,
}

export interface UserState {
  email: string | undefined;
  username: string | undefined;
}

export interface AuthUIContextInterface {
  currentScreen: AuthScreenNames;
  userState: UserState | undefined;

  switchScreen(screen: AuthScreenNames): void;

  setUserState(value: UserState): void;

  onAuthCompleted(): void;
}

export const initialContext: AuthUIContextInterface = {
  currentScreen: AuthScreenNames.Login,
  userState: undefined,
  switchScreen: () => void 0,
  setUserState: () => void 0,
  onAuthCompleted: () => void 0,
};

const AuthUIContext = createContext<AuthUIContextInterface>(initialContext);

export default AuthUIContext;
