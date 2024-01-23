import type { ComponentType, FC } from 'react';
import { useEffect } from 'react';
import { useCorbado } from '@corbado/react-sdk';
import { useNavigate } from 'react-router-dom';

export const withAuthRequired = <P extends object>(Component: ComponentType<P>): FC<P> => {
  return function WithAuthenticationRequired(props: P) {
    const { isAuthenticated, loading } = useCorbado();
    const navigate = useNavigate();

    useEffect(() => {
      if (loading || isAuthenticated) {
        return;
      }

      navigate('/auth');
    }, [loading, isAuthenticated]);

    return isAuthenticated ? <Component {...props} /> : <></>;
  };
};
