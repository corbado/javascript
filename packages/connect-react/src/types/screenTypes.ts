export enum AppendScreenType {
  Init = 'AppendInit',
  AfterHybridLogin = 'AfterHybridLogin',
  AfterError = 'AfterError',
  Success = 'AppendSuccess',
}

export enum LoginScreenType {
  LoginHybridScreen = 'LoginHybridScreen',
  Init = 'Init',
  Success = 'Success',
  PasskeyReLogin = 'PasskeyReLogin',
  Loading = 'Loading',
  ErrorSoft = 'ErrorSoft',
  ErrorHard = 'ErrorHard',
  Invisible = 'Invisible',
}

export enum LoginSecondFactorScreenType {
  Init = 'Init',
  Loading = 'Loading',
  ErrorHard = 'ErrorHard',
}

export enum ManageScreenType {
  Init = 'ManageInit',
  Invisible = 'Invisible',
}
