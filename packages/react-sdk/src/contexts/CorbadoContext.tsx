import type {ICorbadoAppParams, IUser,} from "@corbado/web-core";
import {createContext, type PropsWithChildren,} from "react";

export type IAppProviderParams = PropsWithChildren<ICorbadoAppParams>;

export interface CorbadoContextInterface {
    shortSession: string|undefined
    user: IUser|undefined
    signUpWithPasskey: (email: string, username: string) => Promise<void>
    loginWithPasskey: (email: string) => Promise<void>
    initLoginWithEmailOTP: (email: string) => Promise<void>
    completeLoginWithEmailOTP: (code: string) => Promise<void>
    logout: () => Promise<void>
    initSignUpWithEmailOTP: (email: string, username: string) => Promise<void>
    completeSignUpWithEmailOTP: (code: string) => Promise<void>
}

const missingImplementation = (): never => {
    throw new Error('Please make sure that your components are wrapped inside <CorbadoProvider/>');
};

export const initialContext = {
    shortSession: undefined,
    user: undefined,
    signUpWithPasskey: missingImplementation,
    loginWithPasskey: missingImplementation,
    initLoginWithEmailOTP: missingImplementation,
    completeLoginWithEmailOTP: missingImplementation,
    logout: missingImplementation,
    initSignUpWithEmailOTP: missingImplementation,
    completeSignUpWithEmailOTP: missingImplementation
};

const CorbadoContext = createContext<CorbadoContextInterface>(initialContext)

export default CorbadoContext
