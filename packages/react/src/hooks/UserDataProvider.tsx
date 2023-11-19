import React, {PropsWithChildren, useMemo, useState} from "react"
import UserDataContext, {UserDataContextInterface} from "./UserDataContext";

export const UserDataProvider = ({children}: PropsWithChildren) => {
  const [email, setEmail] = useState<string>()
  const [userName, setUserName] = useState<string>()

  const contextValue = useMemo<UserDataContextInterface>(() => {
    return {
      email,
      setEmail,
      userName,
      setUserName
    }
  }, [
    email,
    setEmail,
    userName,
    setUserName
  ])

  return <UserDataContext.Provider value={contextValue}>{children}</UserDataContext.Provider>
}

export default UserDataProvider
