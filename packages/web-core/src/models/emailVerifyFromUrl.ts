import type { GeneralBlockVerifyIdentifier, VerificationMethod } from '../api';
import { AuthType } from '../api';
import type { AuthProcess } from './authProcess';

type EmailVerifyFromUrlData = {
  blockData: {
    identifier: string;
    retryNotBefore: number;
    verificationMethod: string;
  };
  authType: number;
  processID: string;
};

export class EmailVerifyFromUrl {
  data: GeneralBlockVerifyIdentifier;
  token: string;
  isNewDevice: boolean;
  processID: string;
  authType: AuthType;

  constructor(
    data: GeneralBlockVerifyIdentifier,
    token: string,
    isNewDevice: boolean,
    processID: string,
    authType: AuthType,
  ) {
    this.data = data;
    this.token = token;
    this.isNewDevice = isNewDevice;
    this.processID = processID;
    this.authType = authType;
  }

  static fromURL(encodedProcess: string, token: string, existingProcess: AuthProcess | undefined): EmailVerifyFromUrl {
    const decodedProcess = JSON.parse(atob(encodedProcess)) as EmailVerifyFromUrlData;

    const data: GeneralBlockVerifyIdentifier = {
      alternativeVerificationMethods: [],
      identifier: decodedProcess.blockData.identifier,
      retryNotBefore: decodedProcess.blockData.retryNotBefore,
      verificationMethod: decodedProcess.blockData.verificationMethod as VerificationMethod,
    };

    const isNewDevice = existingProcess?.id !== decodedProcess.processID;
    const authType = AuthType.Signup;

    return new EmailVerifyFromUrl(data, token, isNewDevice, decodedProcess.processID, authType);
  }
}
