import React, {FC, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {FlowHandlerService, FlowNames, ScreenNames, SignUpFlowNames} from "@corbado/web-core"
import FlowHandlerContext, {FlowHandlerContextInterface} from "./FlowHandlerContext"

interface Props {
    projectId: string
}

export const FlowHandlerProvider: FC<PropsWithChildren<Props>> = ({children}) => {
    const [flowHandlerService] = useState(() => new FlowHandlerService(
        SignUpFlowNames.PasskeySignupWithEmailOTPFallback,
        {
            allowUserRegistration: true,
            passkeyAppendInterval: '',
            fallbackLanguage: '',
            autoDetectLanguage: true,
            userFullNameRequired: true,
            webComponentDebug: true,
            environment: '',
        },
        {
            passkeyAppend: true,
            retryPasskeyOnError: true,
            compulsoryEmailVerification: true,
            shouldRedirect: true,
        }
    ))
    const initialized = useRef(false)
    const [currentScreen, setCurrentScreen] = useState<ScreenNames>()
    const [currentFlow, setCurrentFlow] = useState<FlowNames>()

    useEffect(() => {
        if (initialized.current) {
            return
        }

        initialized.current = true

        flowHandlerService.onScreenChange((value: ScreenNames) => setCurrentScreen(value))
        flowHandlerService.onFlowChange((value: FlowNames) => setCurrentFlow(value))

        flowHandlerService.init()
    }, [])


    const navigateNext = useCallback(async (event?: string) => {
        await flowHandlerService.navigateNext(event)
    }, [flowHandlerService])

    const navigateBack = useCallback(() => {
        flowHandlerService.navigateBack()
    }, [flowHandlerService])

    const changeFlow = useCallback((newFlow: FlowNames) => {
        flowHandlerService.changeFlow(newFlow)
    }, [flowHandlerService])

    const contextValue = useMemo<FlowHandlerContextInterface>(() => {
        return {
            currentFlow,
            currentScreen,
            navigateNext,
            navigateBack,
            changeFlow
        }
    }, [
        currentFlow,
        currentScreen,
        navigateNext,
        navigateBack,
        changeFlow
    ])

    return <FlowHandlerContext.Provider value={contextValue}>{children}</FlowHandlerContext.Provider>
}

export default FlowHandlerProvider
