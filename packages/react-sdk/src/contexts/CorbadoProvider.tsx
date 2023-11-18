import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {CorbadoApp, IUser} from "@corbado/web-core"
import CorbadoContext, {CorbadoContextInterface, IAppProviderParams} from "./CorbadoContext"

export const CorbadoProvider: FC<IAppProviderParams> = ({children, ...corbadoParams}) => {
    const [corbadoApp] = useState(() => new CorbadoApp(corbadoParams))
    const [shortSession, setShortSession] = useState<string|undefined>()
    const [user, setUser] = useState<IUser|undefined>()
    const initialized = useRef(false)

    useEffect(() => {
        if (initialized.current) {
            return
        }

        initialized.current = true

        corbadoApp.authService.shortSessionChanges.subscribe((value) => {
            console.log('shortSessionChanges', value)
            if (value !== undefined) {
                setShortSession(value)
            }
        })

        corbadoApp.authService.userChanges.subscribe((value) => {
            console.log('userChanges', value)
            if (value !== undefined) {
                setUser(value)
            }
        })
    }, [])

    const signUpWithPasskey = useCallback((email: string, username: string) => {
        return corbadoApp.authService.signUpWithPasskey(email, username)
    }, [corbadoApp])

    const loginWithPasskey = useCallback((email: string) => {
        return corbadoApp.authService.loginWithPasskey(email)
    }, [corbadoApp])

    const initLoginWithEmailOTP = useCallback((email: string) => {
        return corbadoApp.authService.initLoginWithEmailOTP(email)
    }, [corbadoApp])

    const completeLoginWithEmailOTP = useCallback((email: string) => {
        return corbadoApp.authService.completeLoginWithEmailOTP(email)
    }, [corbadoApp])

    const logout = useCallback(() => {
        return corbadoApp.authService.logout()
    }, [corbadoApp])

    const contextValue = useMemo<CorbadoContextInterface>(() => {
        return {
            shortSession,
            user,
            signUpWithPasskey,
            loginWithPasskey,
            initLoginWithEmailOTP,
            completeLoginWithEmailOTP,
            logout
        }
    }, [
        shortSession,
        user,
        signUpWithPasskey,
        loginWithPasskey,
        initLoginWithEmailOTP,
        completeLoginWithEmailOTP,
        logout
    ])

    return <CorbadoContext.Provider value={contextValue}>{children}</CorbadoContext.Provider>
}

export default CorbadoProvider
