import type { ComponentType, FC } from 'react';
import { useEffect } from 'react';
import {useCorbado} from "@corbado/react-sdk";
import {useNavigate} from "react-router-dom";

export const withAuthRequired = <P extends object>(Component: ComponentType<P>): FC<P> => {
  return function WithAuthenticationRequired(props: P) {
    const { user, loading } = useCorbado();
    const navigate = useNavigate();

    useEffect(() => {
      console.log(loading, user);
      if (loading || user) {
        return;
      }

      navigate('/auth');
    }, [loading, user]);

    return user ? <Component {...props} /> : <></>;
  };
};
