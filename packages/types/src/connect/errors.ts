export type ConnectError = 'PasskeyChallengeAborted' | 'PasskeyNotSupported' | 'FrontendApiNotReachable';

export type ConnectLoginError = ConnectError | 'UserDoesNotExist' | 'PasskeyLoginFailure';

export type ConnectAppendError = ConnectError | 'ConnectTokenProviderError';
