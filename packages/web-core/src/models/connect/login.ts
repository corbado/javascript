export type ConnectLoginInitData = {
  loginAllowed: boolean;
  conditionalUIChallenge: string | null;
  flags: Record<string, string>;
};

export interface ConnectAppendInitData {
  appendAllowed: boolean;
  flags: Record<string, string>;
}
