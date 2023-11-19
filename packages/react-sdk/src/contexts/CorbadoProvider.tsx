import React, {FC, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {CorbadoApp, IUser} from "@corbado/web-core"
import CorbadoContext, {CorbadoContextInterface, IAppProviderParams} from "./CorbadoContext"

export const CorbadoProvider: FC<IAppProviderParams> = ({children, ...corbadoParams}) => {
  const [corbadoApp] = useState(() => new CorbadoApp(corbadoParams))
  const [shortSession, setShortSession] = useState<string | undefined>()
  const [user, setUser] = useState<IUser | undefined>()
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) {
      return
    }

    initialized.current = true

    corbadoApp.authService.shortSessionChanges.subscribe((value) => {
      if (value !== undefined) {
        setShortSession(value)
      }
    })

    corbadoApp.authService.userChanges.subscribe((value) => {
      if (value !== undefined) {
        setUser(value)
      }
    })

    corbadoApp.init()
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

  const completeLoginWithEmailOTP = useCallback((code: string) => {
    return corbadoApp.authService.completeLoginWithEmailOTP(code)
  }, [corbadoApp])

  const logout = useCallback(() => {
    return corbadoApp.authService.logout()
  }, [corbadoApp])

  const initSignUpWithEmailOTP = useCallback((email: string, username: string) => {
    return corbadoApp.authService.initSignUpWithEmailOTP(email, username)
  }, [corbadoApp])

  const completeSignUpWithEmailOTP = useCallback((code: string) => {
    return corbadoApp.authService.completeSignupWithEmailOTP(code)
  }, [corbadoApp])

  const initAutocompletedLoginWithPasskey = useCallback(() => {
    return corbadoApp.authService.initAutocompletedLoginWithPasskey()
  }, [corbadoApp])

  const getProjectConfig = useCallback(() => {
    return corbadoApp.projectService.getProjectConfig()
  }, [corbadoApp])

  const contextValue = useMemo<CorbadoContextInterface>(() => {
    return {
      shortSession,
      user,
      signUpWithPasskey,
      loginWithPasskey,
      initLoginWithEmailOTP,
      completeLoginWithEmailOTP,
      logout,
      initSignUpWithEmailOTP,
      completeSignUpWithEmailOTP,
      initAutocompletedLoginWithPasskey,
      getProjectConfig
    }
  }, [
    shortSession,
    user,
    signUpWithPasskey,
    loginWithPasskey,
    initLoginWithEmailOTP,
    completeLoginWithEmailOTP,
    logout,
    initSignUpWithEmailOTP,
    completeSignUpWithEmailOTP,
    initAutocompletedLoginWithPasskey,
    getProjectConfig
  ])

  return <CorbadoContext.Provider value={contextValue}>{children}</CorbadoContext.Provider>
}

export default CorbadoProvider
