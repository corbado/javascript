export type ConnectError = 'PasswordChallengeAborted' | 'PasskeyNotSupported';

export type ConnectLoginError = ConnectError | 'UserDoesNotExist' | 'PasskeyLoginFailure';

export type ConnectAppendError = ConnectError | 'PasskeyAlreadyExistsOnDevice';
