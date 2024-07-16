export type ConnectError = 'PasskeyChallengeAborted' | 'PasskeyNotSupported';

export type ConnectLoginError = ConnectError | 'UserDoesNotExist' | 'PasskeyLoginFailure';

export type ConnectAppendError = ConnectError | 'PasskeyAlreadyExistsOnDevice';
