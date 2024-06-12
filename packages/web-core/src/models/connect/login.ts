export interface ConnectLoginInitData {
  loginAllowed: boolean;
  conditionalUIChallenge: string | null;
}

export interface ConnectLoginStartData {
  challenge: string;
}
