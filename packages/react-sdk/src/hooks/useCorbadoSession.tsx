import { useContext, useEffect, useState } from "react";

import type { ISessionResponse } from "..";
import { AppContext } from "../contexts/CorbadoAppContext";

export const useCorbadoSession = () => {
  const sessionService = useContext(AppContext)?.sessionService;
  const [session, setSession] = useState<ISessionResponse | null>(null);
  const [signedIn, setSignedIn] = useState<boolean>(false);

  if (sessionService === undefined) {
    throw new Error("useCorbadoSession must be used within an CorbadoProvider");
  }

  useEffect(() => {
    if (!sessionService) {
      return;
    }

    if (sessionService?.shortSession) {
      setSignedIn(true);
    }

    sessionService.onSessionSet((session) => {
      setSession(session);

      if (session?.shortSession) {
        setSignedIn(true);
      }
    });
  }, [sessionService]);

  function getShortSession() {
    return sessionService?.shortSession;
  }

  function getUser() {
    return sessionService?.user;
  }

  function getFullUser() {
    return sessionService?.getFullUser();
  }

  function signOut() {
    sessionService?.deleteSession();
    setSignedIn(false);
    setSession(null);
  }

  return {
    session,
    signedIn,
    getShortSession,
    getUser,
    getFullUser,
    signOut,
  };
};
