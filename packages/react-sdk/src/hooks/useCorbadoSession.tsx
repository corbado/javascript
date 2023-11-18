import { useContext, useEffect, useState } from "react";

import { type ISessionResponse, SessionService } from "..";
import { AppContext } from "../contexts/CorbadoAppContext";

export const useCorbadoSession = () => {
  const sessionService = useContext(AppContext)?.sessionService;
  const onSignOut = useContext(AppContext)?.onSignOut;
  const projectId = useContext(AppContext)?.projectId;
  const [session, setSession] = useState<ISessionResponse | null>(null);
  const [signedIn, setSignedIn] = useState<boolean>(false);

  if (sessionService === undefined) {
    throw new Error("useCorbadoSession must be used within an CorbadoProvider");
  }

  useEffect(() => {
    if (!sessionService) {
      if (SessionService.isSessionActive()) {
        setSignedIn(true);
      }
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
    const shortSession = SessionService.getShortTermSessionToken();

    if (!shortSession) {
      return null;
    }

    return SessionService.getUserFromSession(shortSession);
  }

  function getFullUser() {
    if (!projectId) {
      throw new Error("ProjectId is not defined");
    }

    return SessionService.getFullUser(projectId);
  }

  function signOut() {
    sessionService?.deleteSession();
    setSignedIn(false);
    setSession(null);

    if (onSignOut) {
      onSignOut();
    }
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
