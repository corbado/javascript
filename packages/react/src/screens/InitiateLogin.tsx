import React, {useEffect, useRef, useState} from "react";
import {Trans, useTranslation} from "react-i18next";

import Button from "../components/Button";
import LabelledInput from "../components/LabelledInput";
import Link from "../components/Link";
import Text from "../components/Text";
import useFlowHandler from "../hooks/useFlowHandler";
import useUserData from "../hooks/useUserData";
import {useCorbado} from "@corbado/react-sdk";
import {FlowType, LoginHandler} from "@corbado/web-core";

export const InitiateLogin = () => {
  const {t} = useTranslation()
  const {setEmail, email} = useUserData()
  const [loginHandler, setLoginHandler] = useState<LoginHandler>();
  const {navigateNext, changeFlow} = useFlowHandler();
  const {initAutocompletedLoginWithPasskey, loginWithPasskey} = useCorbado()
  const initialized = useRef(false)
  const conditionalUIStarted = useRef(false)

  useEffect(() => {
    if (initialized.current) {
      return
    }

    initialized.current = true

    initAutocompletedLoginWithPasskey().then(lh => setLoginHandler(lh))
  }, []);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const onFocusEmail = async () => {
    if (conditionalUIStarted.current) {
      return
    }

    conditionalUIStarted.current = true

    try {
      await loginHandler?.completionCallback()
      return navigateNext('passkey_success')
    } catch (e) {
      console.log(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | MouseEvent) => {
    e.preventDefault();

    if (!email) {
      return
    }

    try {
      await loginWithPasskey(email);
      return navigateNext('passkey_success')
    } catch (e) {
      return navigateNext('passkey_error')
    }
  }

  return (
    <>
      <Text variant="header">{t("signup.header")}</Text>
      <Text variant="sub-header">
        {/* "text" is a placeholder value for translations */}
        <Trans i18nKey="signup.sub-header">
          text{" "}
          <Link href="" className="text-secondary-font-color">
            text
          </Link>{" "}
          text
        </Trans>
        <span onClick={() => changeFlow(FlowType.SignUp)}>Create account</span>
      </Text>
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <LabelledInput
              name="name"
              label={t("generic.name")}
              onChange={onChange}
              onFocus={onFocusEmail}
              value={email}
            />
          </div>
          <Button variant="primary">
            {t("signup.continue_email")}
          </Button>
        </form>
      </div>
    </>
  );
};
