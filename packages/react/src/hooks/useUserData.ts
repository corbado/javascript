import {useContext} from "react";
import UserDataContext, {UserDataContextInterface} from "./UserDataContext";

const useUserData = (context = UserDataContext): UserDataContextInterface =>
  useContext(context) as UserDataContextInterface

export default useUserData;
