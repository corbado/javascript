import type { GeneralBlockVerifyIdentifier, VerificationMethod } from '../api';
import { AuthType, BlockType } from '../api';
import { TempAuthProcess } from './authProcess';

type EmailVerifyFromUrlData = {
  blockData: {
    identifier: string;
    retryNotBefore: number;
    verificationMethod: string;
    isPostLoginVerification: boolean;
  };
  authType: number;
  process: {
    tempId: string;
    projectId: string;
    expires: number;
    frontendApiUrl: string;
  };
};

export class EmailVerifyFromUrl {
  data: GeneralBlockVerifyIdentifier;
  token: string;
  process: TempAuthProcess;
  authType: AuthType;

  constructor(data: GeneralBlockVerifyIdentifier, token: string, process: TempAuthProcess, authType: AuthType) {
    this.data = data;
    this.token = token;
    this.process = process;
    this.authType = authType;
  }

  static fromURL(encodedProcess: string, token: string): EmailVerifyFromUrl {
    const decoded = JSON.parse(atob(encodedProcess)) as EmailVerifyFromUrlData;
    const process = decoded.process;

    const data: GeneralBlockVerifyIdentifier = {
      alternativeVerificationMethods: [],
      identifier: decoded.blockData.identifier,
      retryNotBefore: decoded.blockData.retryNotBefore,
      verificationMethod: decoded.blockData.verificationMethod as VerificationMethod,
      isPostLoginVerification: decoded.blockData.isPostLoginVerification,
      blockType: BlockType.EmailVerify,
    };

    let authType: AuthType;
    if (decoded.authType === 0) {
      authType = AuthType.Login;
    } else {
      authType = AuthType.Signup;
    }

    const tempAuthProcess = new TempAuthProcess(
      process.tempId,
      process.projectId,
      process.expires,
      process.frontendApiUrl,
    );

    return new EmailVerifyFromUrl(data, token, tempAuthProcess, authType);
  }
}
