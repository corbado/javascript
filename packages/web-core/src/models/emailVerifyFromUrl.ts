import type { GeneralBlockVerifyIdentifier, VerificationMethod } from '../api';
import { AuthType } from '../api';
import { AuthProcess } from './authProcess';

type EmailVerifyFromUrlData = {
  blockData: {
    identifier: string;
    retryNotBefore: number;
    verificationMethod: string;
    isPostLoginVerification: boolean;
  };
  authType: number;
  process: {
    id: string;
    expires: number;
    frontendApiUrl: string;
  };
};

export class EmailVerifyFromUrl {
  data: GeneralBlockVerifyIdentifier;
  token: string;
  isNewDevice: boolean;
  process: AuthProcess;
  authType: AuthType;

  constructor(
    data: GeneralBlockVerifyIdentifier,
    token: string,
    isNewDevice: boolean,
    process: AuthProcess,
    authType: AuthType,
  ) {
    this.data = data;
    this.token = token;
    this.isNewDevice = isNewDevice;
    this.process = process;
    this.authType = authType;
  }

  static fromURL(encodedProcess: string, token: string, existingProcess: AuthProcess | undefined): EmailVerifyFromUrl {
    console.log('maybeProcess', encodedProcess, existingProcess);
    const decoded = JSON.parse(atob(encodedProcess)) as EmailVerifyFromUrlData;
    const process = decoded.process;

    const data: GeneralBlockVerifyIdentifier = {
      alternativeVerificationMethods: [],
      identifier: decoded.blockData.identifier,
      retryNotBefore: decoded.blockData.retryNotBefore,
      verificationMethod: decoded.blockData.verificationMethod as VerificationMethod,
      isPostLoginVerification: decoded.blockData.isPostLoginVerification,
    };

    const isNewDevice = existingProcess?.id !== process.id;
    let authType: AuthType;
    if (decoded.authType === 0) {
      authType = AuthType.Login;
    } else {
      authType = AuthType.Signup;
    }

    const authProcess = new AuthProcess(process.id, process.expires, process.frontendApiUrl);

    return new EmailVerifyFromUrl(data, token, isNewDevice, authProcess, authType);
  }
}
