import React, {FC, useCallback, useMemo, useState} from "react";
import {CorbadoApp} from "@corbado/web-core";
import CorbadoContext, {CorbadoContextInterface, IAppProviderParams} from "./CorbadoContext";

export const CorbadoProvider: FC<IAppProviderParams> = ({children, ...corbadoParams}) => {
    const [corbadoApp] = useState(() => new CorbadoApp(corbadoParams));

    const signUpWithPasskey = useCallback((email: string, username: string) => {
        return corbadoApp.authService.signUpWithPasskey(email, username);
    }, [corbadoApp]);

    const loginWithPasskey = useCallback((email: string) => {
        return corbadoApp.authService.loginWithPasskey(email);
    }, [corbadoApp]);

    const initLoginWithEmailOTP = useCallback((email: string) => {
        return corbadoApp.authService.initLoginWithEmailOTP(email);
    }, [corbadoApp]);

    const completeLoginWithEmailOTP = useCallback((email: string) => {
        return corbadoApp.authService.completeLoginWithEmailOTP(email);
    }, [corbadoApp]);

    const contextValue = useMemo<CorbadoContextInterface>(() => {
        return {
            signUpWithPasskey,
            loginWithPasskey,
            initLoginWithEmailOTP,
            completeLoginWithEmailOTP
        };
    }, [
        signUpWithPasskey,
        loginWithPasskey,
        initLoginWithEmailOTP,
        completeLoginWithEmailOTP
    ]);

    return <CorbadoContext.Provider value={contextValue}>{children}</CorbadoContext.Provider>;
}

export default CorbadoProvider
