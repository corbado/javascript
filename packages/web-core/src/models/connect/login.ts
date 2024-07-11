import type { Passkey } from '../../api/v2';

export type ConnectLoginInitData = {
  loginAllowed: boolean;
  conditionalUIChallenge: string | null;
  flags: Record<string, string>;
};

export interface ConnectAppendInitData {
  appendAllowed: boolean;
  flags: Record<string, string>;
}

export interface ConnectManageInitData {
  manageAllowed: boolean;
  flags: Record<string, string>;
}

export interface ConnectManageListData {
  passkeys: Array<Passkey>;
}
