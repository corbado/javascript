const ConnectErrorsConst = {
  PasskeyChallengeAborted: 'PasswordChallengeAborted',
  PasskeyNotSupported: 'PasskeyNotSupported',
} as const;

const ConnectLoginErrorsConst = {
  ...ConnectErrorsConst,
  UserDoesNotExist: 'UserDoesNotExist',
  PasskeyLoginFailure: 'PasskeyLoginFailure',
} as const;

const ConnectAppendErrorsConst = {
  ...ConnectErrorsConst,
  PasskeyAlreadyExistsOnDevice: 'PasskeyAlreadyExistsOnDevice',
} as const;

export type ConnectError = (typeof ConnectErrorsConst)[keyof typeof ConnectErrorsConst];
export type ConnectLoginError = (typeof ConnectLoginErrorsConst)[keyof typeof ConnectLoginErrorsConst];
export type ConnectAppendError = (typeof ConnectAppendErrorsConst)[keyof typeof ConnectAppendErrorsConst];
